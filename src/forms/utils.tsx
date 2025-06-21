import { SubmitButton, TextAreaField, TextField } from "./forms";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  formContext,
  fieldContext,
  formComponents: { SubmitButton },
  fieldComponents: { TextField, TextAreaField },
});
