import React from "react";

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  showText?: boolean;
}

export default function ProgressBar({
  value,
  className = "",
  showText = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round(value), 0), 100);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {showText && (
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="label-micro text-muted">Progress</span>
          <span className="font-mono text-accent-text">{percentage}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-border-strong rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
