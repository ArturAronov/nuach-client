"use client";

import { useAppForm, withForm } from "@/forms/utils";
import { postPrompt } from "@/utilsApi/postPrompt";
import { formOptions } from "@tanstack/react-form";
// import { z } from "zod";

const formOpt = formOptions({
  defaultValues: {
    source: "",
    prompt: "",
  },
  validators: {
    onSubmitAsync: async ({
      value,
    }: {
      value: { source: string; prompt: string };
    }) => {
      console.log(value);
      try {
        return await postPrompt(value.prompt);
      } catch (error) {
        console.error("Submission error:", error);
        return "Form submission failed. Please try again.";
      }
    },
  },
});

const HomeForm = withForm({
  ...formOpt,
  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* <form.AppField name="source">
          {(field) => (
            <field.TextField placeholder="book / exam prep" label="Source" />
          )}
        </form.AppField> */}
        <form.AppField name="prompt">
          {(field) => (
            <field.TextAreaField
              onChange={(e) => form.setFieldValue("prompt", e.target.value)}
              placeholder="dssdf"
              label="Prompt"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton label="Submit" className="py-5 text-center" />
        </form.AppForm>
      </form>
    );
  },
});

const SignInPage = () => {
  const form = useAppForm({ ...formOpt });
  return (
    <main className="w-fit">
      <HomeForm form={form} />
    </main>
  );
};

export default SignInPage;
