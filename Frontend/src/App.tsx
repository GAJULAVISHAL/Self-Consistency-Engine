import { useRef, useState, KeyboardEvent } from "react";
import { useTheme } from "./hooks/useTheme";
import { ThemeToggle } from "./components/ThemeToggle";
import { ModelCard } from "./components/ModelCard";
import { ConnectorLines } from "./components/ConnectorLines";
import { SkeletonCard, SkeletonJudgement } from "./components/SkeletonCard";
import { queryModel, judgeModelResponses, type ModelResponse } from "./services/api";

// All models the engine fans out to
const MODELS = ["gemini-2.5-flash-lite", "gemma-4-31b-it", "o3-mini"] as const;

type Phase = "idle" | "querying" | "judging" | "done" | "error";

export default function App() {
  const { toggle } = useTheme();

  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [responses, setResponses] = useState<(ModelResponse | null)[]>([null, null, null]);
  const [judgment, setJudgment] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Refs are always created (Rules of Hooks), used only when phase === "done" | "judging"
  const modelRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const judgementRef = useRef<HTMLDivElement>(null);

  async function handleSubmit() {
    const q = prompt.trim();
    if (!q || phase === "querying" || phase === "judging") return;

    // Reset state
    setPhase("querying");
    setResponses([null, null, null]);
    setJudgment(null);
    setErrorMsg("");

    try {
      // Fire all model queries simultaneously.
      // As each promise resolves it immediately updates its slot — no waiting for the others.
      const modelPromises = MODELS.map((model, idx) =>
        queryModel(model, q).then((result) => {
          setResponses((prev) => {
            const next = [...prev];
            next[idx] = result;
            return next;
          });
          return result;
        })
      );

      // Wait for all to finish (Promise.all preserves order in the resolved array)
      const allResponses = await Promise.all(modelPromises);

      // Now call the judge with all collected responses
      setPhase("judging");
      const verdict = await judgeModelResponses(q, allResponses);
      setJudgment(verdict);
      setPhase("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setPhase("error");
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  const isLoading = phase === "querying" || phase === "judging";
  const showResults = phase === "querying" || phase === "judging" || phase === "done";

  return (
    <div className="min-h-screen bg-(--background) transition-colors duration-300">
      <div className="max-w-5xl w-full mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold tracking-widest uppercase opacity-50">
              Self-Consistency
            </span>
            <h1 className="text-lg font-semibold tracking-tight text-(--foreground)">
              Engine
            </h1>
          </div>
          <ThemeToggle onToggle={toggle} />
        </header>

        {/* Prompt Input */}
        <div className="flex gap-2 w-full">
          <input
            id="prompt-input"
            type="text"
            placeholder="Enter your prompt…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="
              flex-1 rounded-md border border-neutral-200 dark:border-neutral-800
              bg-transparent px-3 py-2 text-sm
              placeholder:opacity-40
              text-(--foreground)
              focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-300
            "
          />
          <button
            id="submit-btn"
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="
              rounded-md border border-neutral-200 dark:border-neutral-800
              px-4 py-2 text-sm font-medium
              text-(--foreground)
              hover:bg-(--foreground)/5
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            {phase === "querying" ? "Querying…" : phase === "judging" ? "Judging…" : "Submit"}
          </button>
        </div>

        {/* Error banner */}
        {phase === "error" && (
          <p className="text-sm text-red-500 dark:text-red-400 opacity-80">
            ⚠ {errorMsg}
          </p>
        )}

        {/* ── Results area: shown as soon as querying starts ── */}
        {showResults && (
          <div className="relative flex flex-col gap-10">
            <ConnectorLines modelRefs={modelRefs} judgementRef={judgementRef} />

            {/* Model cards — each replaces its skeleton the moment its promise resolves */}
            <div className="grid grid-cols-3 gap-3 relative z-10">
              {MODELS.map((model, i) => {
                const r = responses[i];
                return r ? (
                  <ModelCard
                    key={model}
                    title={r.model}
                    body={r.response ?? "⚠ No response received."}
                    cardRef={modelRefs[i]}
                  />
                ) : (
                  <SkeletonCard key={model} />
                );
              })}
            </div>

            {/* Judgement — shows skeleton while judging, real content when done */}
            <div
              ref={judgementRef}
              id="judgement-result"
              className="
                relative z-10 w-full rounded-lg
                border border-neutral-200 dark:border-neutral-800
                bg-(--background)
                shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_14px_rgb(0,0,0,0.5)]
                transition-colors duration-300
              "
            >
              {phase === "done" && judgment !== null ? (
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-widest uppercase opacity-50">
                      Judgement
                    </span>
                    <div className="flex-1 border-t border-dashed border-neutral-200 dark:border-neutral-800" />
                  </div>
                  <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">
                    {judgment}
                  </p>
                </div>
              ) : (
                <SkeletonJudgement />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
