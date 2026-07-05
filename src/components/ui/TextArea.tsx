import React, { useEffect, useRef, useCallback, useId } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id?: string;
  helperText?: string;
  error?: string;
  autoResize?: boolean;
}

export default function TextArea({
  label,
  id: customId,
  helperText,
  error,
  autoResize = false,
  className = "",
  rows = 3,
  ...props
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const generatedId = useId();
  const id = customId || generatedId;

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea && autoResize) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [autoResize]);

  useEffect(() => {
    resize();
  }, [props.value, resize]);

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
      <textarea
        ref={textareaRef}
        id={id}
        rows={rows}
        onInput={resize}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        className={`w-full px-4 py-2.5 bg-paper border ${
          error ? "border-danger" : "border-border-strong hover:border-muted"
        } rounded-xl text-sm text-ink font-sans focus-ring focus:border-accent placeholder-muted-2/60 resize-none transition-colors duration-150 ${className}`}
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
