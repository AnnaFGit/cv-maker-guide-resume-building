import React from "react";

interface ScoreDialProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function ScoreDial({
  score,
  size = 120,
  strokeWidth = 10,
  className = "",
}: ScoreDialProps) {
  const clampedScore = Math.min(Math.max(Math.round(score), 0), 100);
  
  // SVG calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedScore / 100) * circumference;

  // Determine color based on score tier
  let strokeColor = "stroke-danger"; // < 50
  let textColor = "text-danger";
  
  if (clampedScore >= 75) {
    strokeColor = "stroke-success"; // >= 75
    textColor = "text-success";
  } else if (clampedScore >= 50) {
    strokeColor = "stroke-accent"; // 50 to 74
    textColor = "text-accent-text";
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Circle */}
        <circle
          className="stroke-border-strong"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          className={`transition-all duration-500 ease-out ${strokeColor}`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`font-serif text-3xl font-extrabold tracking-tight ${textColor}`}>
          {clampedScore}
        </span>
        <span className="label-micro text-[9px] text-muted-2">Match</span>
      </div>
    </div>
  );
}
