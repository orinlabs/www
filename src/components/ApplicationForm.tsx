import { useEffect, useState } from 'react';

import { ArrowRight } from 'lucide-react';
import {
  TextArea,
  TextInput,
} from 'slate-ui';

interface ApplicationFormProps {
  roleSlug: string;
  roleTitle: string;
}

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  links: string;
  resumeUrl: string;
  pitch: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  links: "",
  resumeUrl: "",
  pitch: "",
};

// Identity fields are shared across every role; the pitch is role-specific.
const PROFILE_KEY = "orin:application-profile";
const pitchKey = (slug: string) => `orin:application-pitch:${slug}`;

function loadInitialState(roleSlug: string): FormState {
  if (typeof window === "undefined") {
    return INITIAL_STATE;
  }

  try {
    const profileRaw = window.localStorage.getItem(PROFILE_KEY);
    const profile = profileRaw
      ? (JSON.parse(profileRaw) as Partial<FormState>)
      : {};
    return {
      name: profile.name ?? "",
      email: profile.email ?? "",
      links: profile.links ?? "",
      resumeUrl: profile.resumeUrl ?? "",
      pitch: window.localStorage.getItem(pitchKey(roleSlug)) ?? "",
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function ApplicationForm({ roleSlug, roleTitle }: ApplicationFormProps) {
  const [form, setForm] = useState<FormState>(() => loadInitialState(roleSlug));
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | undefined>();

  // Persist the applicant's input so a refresh or navigating between roles
  // doesn't lose their progress.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const { name, email, links, resumeUrl, pitch } = form;
      window.localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({ name, email, links, resumeUrl }),
      );
      if (pitch.trim().length > 0) {
        window.localStorage.setItem(pitchKey(roleSlug), pitch);
      } else {
        window.localStorage.removeItem(pitchKey(roleSlug));
      }
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
  }, [form, roleSlug]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.name.trim().length > 0 &&
    form.email.includes("@") &&
    form.pitch.trim().length > 0;

  const hasInput = Object.values(form).some((v) => v.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || status === "submitting") return;

    setStatus("submitting");
    setError(undefined);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleSlug,
          roleTitle,
          ...form,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      setStatus("success");
      // Keep their saved profile for future applications, but clear this
      // role's pitch now that it's been submitted.
      setForm((prev) => ({ ...prev, pitch: "" }));
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="border border-neutral-200 dark:border-neutral-800 bg-[#f4f5f0] dark:bg-neutral-900 p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Thanks — we'll be in touch.
        </h3>
        <p className="text-neutral-700 dark:text-neutral-300">
          Your application for <strong>{roleTitle}</strong> is in. We read every
          one and reply within a week.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <TextInput
        label="Name"
        required
        value={form.name}
        onChange={(v) => setField("name", v)}
        placeholder="Ada Lovelace"
      />

      <TextInput
        label="Email"
        required
        type="email"
        value={form.email}
        onChange={(v) => setField("email", v)}
        placeholder="you@example.com"
      />

      <TextArea
        label="Links"
        value={form.links}
        onChange={(v) => setField("links", v)}
        placeholder="GitHub, LinkedIn, personal site, papers — one per line"
        rows={3}
      />

      <TextInput
        label="Resume URL"
        value={form.resumeUrl}
        onChange={(v) => setField("resumeUrl", v)}
        placeholder="Link to a Google Drive / Dropbox / personal-site PDF"
      />

      <TextArea
        label="Why Orin Labs?"
        required
        value={form.pitch}
        onChange={(v) => setField("pitch", v)}
        placeholder="A few paragraphs on why you, why this role, and what you'd want to ship in your first 90 days."
        rows={6}
      />

      {error && (
        <p className="text-sm text-error-500">{error}</p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!isValid || status === "submitting"}
          className="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-950"
        >
          {status === "submitting" ? "Sending" : "Submit application"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        {hasInput && (
          <p className="text-xs text-neutral-400">
            Your application has saved in your browser storage.
          </p>
        )}
      </div>
    </form>
  );
}
