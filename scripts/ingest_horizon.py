#!/usr/bin/env python3
"""Regenerate src/components/horizon/combinedResults.ts from the private run.

Reads horizon-1-private/scripts/analysis/horizon1_runs_export.json (the
build_export.py per-case export) and trims it to exactly what the Horizon page
derives at runtime: a per-task metadata map (difficulty + axes) and per-run
cases (task id, pass, cost, tokens, time). Run this whenever the benchmark run
updates; never edit combinedResults.ts by hand.

Usage:
  uv run python scripts/ingest_horizon.py [path/to/horizon1_runs_export.json]
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEFAULT_SOURCE = (
    REPO.parent
    / "horizon-1-private"
    / "scripts"
    / "analysis"
    / "horizon1_runs_export.json"
)
OUT = REPO / "src" / "components" / "horizon" / "combinedResults.ts"
# Public, downloadable copy of the same derived data (linked from the page).
PUBLIC_JSON = REPO / "public" / "horizon-results.json"

# Export agent name -> the raw harness id displayHarness() maps to a label.
AGENT_TO_HARNESS = {
    "RLM": "trace-rlm",
    "RAG": "trace-rag",
    "ClaudeCode": "claude-code",
    "Hermes": "hermes",
    "Codex": "codex",
    "OpenClaw": "openclaw",
}

# Per-task metadata: (source key, emitted key). difficulty drives the splits;
# the axes feed the difficulty figures. Order is preserved in the output.
TASK_FIELDS = [
    ("difficulty", "difficulty"),
    ("anticipability", "anticipability"),
    ("burial_depth", "burial_depth"),
    ("trace_lines", "trace_lines"),
    ("md", "misdirection"),
    ("n_hops", "n_hops"),
    ("family", "family"),
    ("category", "category"),
    ("adversarial", "adversarial"),
    ("flags", "flags"),
    ("tags", "tags"),
]

HEADER = (
    "// AUTO-GENERATED from horizon-1-private/scripts/analysis/horizon1_runs_export.json.\n"
    "// Trimmed to what the page derives: a per-task metadata map (difficulty + axes)\n"
    "// and per-run cases (task id, pass, cost, tokens, time). Difficulty is joined\n"
    "// from `tasks` at runtime. Regenerate when the run updates; do not edit by hand.\n"
    'import type { CombinedData } from "./combined";\n\n'
    "export const COMBINED: CombinedData = "
)


def slug(run_label: str) -> str:
    return run_label.replace("/", "-").replace(" ", "-").lower()


def trim_task(meta: dict) -> dict:
    return {out: meta[src] for src, out in TASK_FIELDS if src in meta}


def round_or_none(v, digits: int):
    return round(v, digits) if isinstance(v, (int, float)) else None


def trim_case(case: dict) -> dict:
    return {
        "task": case["task"],
        "passed": case.get("passed"),
        "cost": round_or_none(case.get("cost_usd"), 4),
        "tokens": case.get("total_tokens")
        if isinstance(case.get("total_tokens"), int)
        else None,
        "time": round_or_none(case.get("time_sec"), 1),
    }


def trim_run(run: dict) -> dict | None:
    cases = run.get("cases") or []
    if not cases:
        return None
    # The published per-task aggregates are authoritative for cost/tokens/time;
    # the per-case cost is unreliable or missing for some agents (e.g. OpenClaw,
    # Hermes), so carry the reported numbers through rather than re-deriving.
    rep = run.get("reported") or {}
    return {
        "runKey": slug(run["run"]),
        "harness": AGENT_TO_HARNESS.get(run["agent"], run["agent"].lower()),
        "model": run["model"],
        "modelName": run.get("model"),
        "reported": {
            "cost": rep.get("cost_per_task_usd"),
            "tokens": rep.get("tokens_per_task"),
            "time": rep.get("time_per_task_sec"),
            "tokensEstimated": bool(rep.get("tokens_estimated")),
        },
        "cases": [trim_case(c) for c in cases],
    }


def main() -> None:
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SOURCE
    data = json.loads(source.read_text())

    runs = [r for r in (trim_run(r) for r in data["runs"]) if r is not None]
    combined = {
        "tasks": {tid: trim_task(meta) for tid, meta in data["cases"].items()},
        "runs": runs,
    }

    payload = json.dumps(combined, separators=(",", ":"), ensure_ascii=False)
    OUT.write_text(f"{HEADER}{payload};\n")

    meta = data.get("meta", {})
    # Public download mirrors the runtime data, plus source provenance so the
    # standalone file is self-describing. Pretty-printed for readability.
    public = {
        "meta": {
            "source": "Horizon (Orin Labs)",
            "generated_at": meta.get("generated_at"),
            "note": (
                "Per-task metadata (difficulty + axes) and per-run cases "
                "(task id, pass, cost, tokens, time). Same data the leaderboard "
                "is derived from."
            ),
        },
        **combined,
    }
    PUBLIC_JSON.write_text(
        json.dumps(public, indent=2, ensure_ascii=False) + "\n"
    )

    agents = sorted({r["harness"] for r in runs})
    print(
        f"Wrote {OUT.relative_to(REPO)} and {PUBLIC_JSON.relative_to(REPO)}: "
        f"{len(runs)} runs, {len(combined['tasks'])} tasks "
        f"(harnesses: {', '.join(agents)}; "
        f"source generated_at {meta.get('generated_at', '?')})"
    )


if __name__ == "__main__":
    main()
