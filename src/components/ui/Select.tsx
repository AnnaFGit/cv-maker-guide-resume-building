import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  helperText?: string;
  error?: string;
}

export default function Select({
  label,
  id,
  options,
  helperText,
  error,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="label-micro text-xs text-muted">
          {label}
        </label>
        {error && (
          <span className="text-xs font-semibold text-danger" id={`${id}-error`}>
            {error}
          </span>
        )}
      </div>
      <div className="relative w-full">
        <select
          id={id}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={`w-full appearance-none px-4 py-2.5 bg-paper border ${
            error ? "border-danger" : "border-border-strong hover:border-muted"
          } rounded-xl text-sm text-ink font-sans focus-ring focus:border-accent transition-colors duration-150 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
      {helperText && !error && (
        <span id={`${id}-helper`} className="text-xs text-muted-2">
          {helperText}
        </span>
      )}
    </div>
  );
}
