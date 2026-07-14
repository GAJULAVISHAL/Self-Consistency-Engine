import React from "react";

interface ModelCardProps {
  title: string;
  body: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function ModelCard({ title, body, cardRef }: ModelCardProps) {
  return (
    <div
      ref={cardRef}
      className="
        relative z-10 w-full min-h-40 p-4 flex flex-col gap-2
        border border-neutral-200 dark:border-neutral-800
        rounded-lg bg-(--background)
        shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_14px_rgb(0,0,0,0.5)]
        transition-colors duration-300
      "
    >
      <h2 className="text-xs font-semibold tracking-widest uppercase opacity-60 shrink-0">
        {title}
      </h2>
      <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">
        {body}
      </p>
    </div>
  );
}
