#!/usr/bin/env python3
"""Regenerate src/components/horizon/combinedResults.ts from the private run.

Reads horizon-1-private/jobs/combined_results.json and trims it to exactly what
the Horizon page derives at runtime: a per-task metadata map (difficulty +
axes) and per-run cases (task id, pass, cost, tokens, time). Run this whenever
the benchmark run updates; never edit combinedResults.ts by hand.

Usage:
  uv run python scripts/ingest_horizon.py [path/to/combined_results.json]
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEFAULT_SOURCE = REPO.parent / "horizon-1-private" / "jobs" / "combined_results.json"
OUT = REPO / "src" / "components" / "horizon" / "combinedResults.ts"

# Per-task metadata fields carried through (difficulty drives the splits; the
# rest are kept for future figures). Order is preserved in the emitted file.
TASK_FIELDS = [
    "difficulty",
    "semantic_distance",
    "misdirection",
    "n_hops",
    "burial_depth_tokens",
    "family",
    "category",
    "adversarial",
    "flags",
    "tags",
]

HEADER = (
    "// AUTO-GENERATED from horizon-1-private/jobs/combined_results.json.\n"
    "// Trimmed to what the page derives: a per-task metadata map (difficulty + axes)\n"
    "// and per-run cases (task id, pass, cost, tokens, time). Difficulty is joined\n"
    "// from `tasks` at runtime. Regenerate when the run updates; do not edit by hand.\n"
    'import type { CombinedData } from "./combined";\n\n'
    "export const COMBINED: CombinedData = "
)


def trim_task(meta: dict) -> dict:
    return {k: meta[k] for k in TASK_FIELDS if k in meta}


def trim_case(case: dict) -> dict:
    cost_usd = case.get("cost_usd")
    cost = (
        round(cost_usd["value"], 4)
        if isinstance(cost_usd, dict) and cost_usd.get("value") is not None
        else None
    )
    tokens = case.get("tokens")
    total = (
        tokens["total"]
        if isinstance(tokens, dict) and tokens.get("total") is not None
        else None
    )
    time_sec = case.get("time_sec")
    secs = (
        round(time_sec["agent_exec"], 1)
        if isinstance(time_sec, dict) and time_sec.get("agent_exec") is not None
        else None
    )
    return {
        "task": case["task"],
        "passed": case.get("passed"),
        "cost": cost,
        "tokens": total,
        "time": secs,
    }


def trim_run(run_key: str, run: dict) -> dict:
    cases = run["cases"]
    case_list = cases.values() if isinstance(cases, dict) else cases
    return {
        "runKey": run_key,
        "harness": run["harness"],
        "model": run["model"],
        "modelName": run.get("model_name"),
        "cases": [trim_case(c) for c in case_list],
    }


def main() -> None:
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SOURCE
    data = json.loads(source.read_text())

    combined = {
        "tasks": {tid: trim_task(meta) for tid, meta in data["tasks"].items()},
        "runs": [trim_run(rk, r) for rk, r in data["runs"].items()],
    }

    payload = json.dumps(combined, separators=(",", ":"), ensure_ascii=False)
    OUT.write_text(f"{HEADER}{payload};\n")

    meta = data.get("_meta", {})
    print(
        f"Wrote {OUT.relative_to(REPO)}: "
        f"{len(combined['runs'])} runs, {len(combined['tasks'])} tasks "
        f"(source generated_at {meta.get('generated_at', '?')})"
    )


if __name__ == "__main__":
    main()
