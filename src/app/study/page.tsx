"use client";

import { useStudyTopic } from "@/hooks/useStudyTopic";
import { useAppForm, withForm } from "@/forms/utils";
import { formOptions } from "@tanstack/react-form";
import { postPrompt } from "@/utilsApi/getPrompt";

let outputDisplay = "";
let outputError = "";

const studyTopicFormOpt = formOptions({
  defaultValues: {
    topic: "",
    question: "",
  },
  validators: {
    onSubmitAsync: async ({ value }: { value: { topic: string } }) => {
      try {
        outputDisplay = "";
        outputError = "";

        const output = await postPrompt(value.topic);
        if (output?.question) outputDisplay = output.question;
        else if (output?.error) outputError = output.error;
      } catch (error) {
        console.error("Submission error:", error);
        return "Form submission failed. Please try again.";
      }
    },
  },
});

const answerFormOpt = formOptions({
  defaultValues: {
    topic: "",
    answer: "",
  },
  validators: {
    onSubmitAsync: async ({
      value,
    }: {
      value: { answer: string; topic: string };
    }) => {
      try {
        // await postAnswer(value);
        console.log(value);
      } catch (error) {
        console.error("Submission error:", error);
        return "Form submission failed. Please try again.";
      }
    },
  },
});

const CombinedForms = withForm({
  ...studyTopicFormOpt,
  render: function Render({ form: studyTopicForm }) {
    const answerForm = useAppForm({ ...answerFormOpt });
    const { studyTopicStore, updateStudyTopic } = useStudyTopic();

    return (
      <div className="space-y-8">
        <div>
          <form
            className="flex gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              studyTopicForm.handleSubmit();
              updateStudyTopic(studyTopicForm.state.values.topic);
            }}
          >
            <studyTopicForm.AppField name="topic">
              {(field) => (
                <field.TextAreaField
                  onChange={(e) =>
                    studyTopicForm.setFieldValue("topic", e.target.value)
                  }
                  label="Generate study topic"
                />
              )}
            </studyTopicForm.AppField>
            <studyTopicForm.AppForm>
              <studyTopicForm.SubmitButton
                label="Generate"
                className="pt-6 text-center button-primary"
              />
            </studyTopicForm.AppForm>
          </form>
          <p className="text-red-800 text-sm font-bold">{outputError}</p>
          <p>{outputDisplay}</p>
        </div>

        <div>
          <form
            className="flex gap-5"
            onSubmit={(e) => {
              if (!studyTopicStore) return null;
              answerForm.setFieldValue("topic", studyTopicStore);

              e.preventDefault();
              answerForm.handleSubmit();
            }}
          >
            <answerForm.AppField name="answer">
              {(field) => (
                <field.TextAreaField
                  onChange={(e) =>
                    answerForm.setFieldValue("answer", e.target.value)
                  }
                  label="Answer"
                />
              )}
            </answerForm.AppField>
            <answerForm.AppForm>
              <answerForm.SubmitButton
                label="Submit Answer"
                className="pt-6 text-center button-secondary"
              />
            </answerForm.AppForm>
          </form>
        </div>
      </div>
    );
  },
});

const CombinedFormsContainer = () => {
  const form = useAppForm({ ...studyTopicFormOpt });
  return (
    <main className="w-fit">
      <CombinedForms form={form} />
    </main>
  );
};

export default CombinedFormsContainer;
