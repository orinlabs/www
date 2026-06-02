import { useState } from 'react';

import { ArrowRight } from 'lucide-react';
import {
  Button,
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

export function ApplicationForm({ roleSlug, roleTitle }: ApplicationFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | undefined>();

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.name.trim().length > 0 &&
    form.email.includes("@") &&
    form.pitch.trim().length > 0;

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
      setForm(INITIAL_STATE);
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
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#f4f5f0] dark:bg-neutral-900 p-6 sm:p-8">
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

      <div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid}
          loading={status === "submitting"}
          iconRight={ArrowRight}
        >
          {status === "submitting" ? "Sending" : "Submit application"}
        </Button>
      </div>
    </form>
  );
}
