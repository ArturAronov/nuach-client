"use client";

import { HTMLAttributes, TextareaHTMLAttributes } from "react";
import { useFieldContext, useFormContext } from "./utils";

export const TextField = ({
  label,
  ...rest
}: {
  label: string;
} & TextareaHTMLAttributes<HTMLInputElement>) => {
  const field = useFieldContext<string>();

  return (
    <div>
      <label className="pl-1">{label}</label>
      <input
        {...rest}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors.length ? (
        <span className="text-red-700 text-caption pl-1">
          {field.state.meta.errors.join(",")}
        </span>
      ) : null}
    </div>
  );
};

export const TextAreaField = ({
  label,
  className,
  ...rest
}: {
  label: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const field = useFieldContext<string>();

  return (
    <div>
      <label className="pl-1">{label}</label>
      <textarea
        {...rest}
        value={field.state.value}
        className={className || ""}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors.length ? (
        <span className="text-red-700 text-caption pl-1">
          {field.state.meta.errors.join(",")}
        </span>
      ) : null}
    </div>
  );
};

export const SubmitButton = ({
  label,
  btnStyle,
  ...rest
}: {
  label: string;
  btnStyle?: string;
} & HTMLAttributes<HTMLDivElement>) => {
  const form = useFormContext();

  return (
    <div {...rest}>
      <form.Subscribe
        selector={(state) => [state.isSubmitting, state.canSubmit]}
      >
        {([isSubmitting, canSubmit]) => (
          <button
            type="submit"
            title={label}
            className={btnStyle ? btnStyle : ""}
            disabled={isSubmitting || !canSubmit}
          >
            {isSubmitting ? "Submitting..." : label}
          </button>
        )}
      </form.Subscribe>
    </div>
  );
};
