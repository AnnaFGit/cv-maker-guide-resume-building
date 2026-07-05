import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export default function Card({
  children,
  hoverEffect = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-paper border border-border rounded-2xl p-5 shadow-[0_1px_3px_rgba(33,29,24,0.08)] transition-all duration-200 ${
        hoverEffect ? "hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(33,29,24,0.06)] cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
