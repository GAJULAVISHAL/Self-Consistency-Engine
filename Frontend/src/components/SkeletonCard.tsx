export function SkeletonCard() {
  return (
    <div
      className="
        relative z-10 w-full min-h-40 p-4 flex flex-col gap-3
        border border-neutral-200 dark:border-neutral-800
        rounded-lg bg-(--background)
        shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_14px_rgb(0,0,0,0.5)]
        overflow-hidden
      "
      aria-busy="true"
    >
      {/* Title shimmer */}
      <div className="h-2.5 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />

      {/* Body shimmers */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="h-2 w-full    rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.05s" }} />
        <div className="h-2 w-11/12  rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.10s" }} />
        <div className="h-2 w-4/5    rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.15s" }} />
        <div className="h-2 w-full    rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.20s" }} />
        <div className="h-2 w-3/4    rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.25s" }} />
        <div className="h-2 w-5/6    rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.30s" }} />
      </div>
    </div>
  );
}

export function SkeletonJudgement() {
  return (
    <div
      className="
        relative z-10 w-full rounded-lg
        border border-neutral-200 dark:border-neutral-800
        p-4 flex flex-col gap-3
        bg-(--background)
        shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_14px_rgb(0,0,0,0.5)]
      "
      aria-busy="true"
    >
      {/* Header row */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>

      {/* Body lines */}
      <div className="flex flex-col gap-2">
        <div className="h-2 w-full   rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.05s" }} />
        <div className="h-2 w-11/12 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.10s" }} />
        <div className="h-2 w-4/5   rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.15s" }} />
        <div className="h-2 w-full   rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.20s" }} />
        <div className="h-2 w-5/6   rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.25s" }} />
        <div className="h-2 w-3/4   rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" style={{ animationDelay: "0.30s" }} />
      </div>
    </div>
  );
}
