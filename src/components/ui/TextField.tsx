import React, { useId } from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  helperText?: string;
  error?: string;
}

export default function TextField({
  label,
  id: customId,
  helperText,
  error,
  className = "",
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="label-micro text-xs text-muted font-mono uppercase tracking-[0.12em]">
          {label}
        </label>
        {error && (
          <span className="text-xs font-semibold text-danger" id={`${id}-error`}>
            {error}
          </span>
        )}
      </div>
      <input
        id={id}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        className={`w-full px-4 py-2.5 bg-paper border ${
          error ? "border-danger" : "border-border-strong hover:border-muted"
        } rounded-xl text-sm text-ink font-sans focus-ring focus:border-accent placeholder-muted-2/60 transition-colors duration-150 ${className}`}
        {...props}
      />
      {helperText && !error && (
        <span id={`${id}-helper`} className="text-xs text-muted-2">
          {helperText}
        </span>
      )}
    </div>
  );
}
