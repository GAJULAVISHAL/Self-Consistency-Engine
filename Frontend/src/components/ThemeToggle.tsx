import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  onToggle: () => void;
}

export function ThemeToggle({ onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      id="theme-toggle"
      className="
        relative p-2 border border-dashed rounded-md
        flex items-center justify-center size-8 cursor-pointer
        border-neutral-200 dark:border-neutral-800
        hover:bg-(--foreground)/5
        transition-colors duration-200
      "
    >
      <Moon className="absolute size-4 shrink-0 dark:scale-0 scale-100 dark:rotate-45 transition-all duration-300 text-(--foreground)" />
      <Sun className="absolute size-4 shrink-0 dark:scale-100 scale-0 dark:rotate-0 rotate-45 transition-all duration-300 text-(--foreground)" />
    </button>
  );
}
