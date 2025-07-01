"use client";

import { useStudyTopic } from "@/hooks/useStudyTopic";
import { useAppForm, withForm } from "@/forms/utils";
import { formOptions } from "@tanstack/react-form";
import { postPrompt } from "@/utilsApi/getPrompt";
import { postAnswer } from "@/utilsApi/postAnswer";

let recievedQuestion = "";
let promptResponse = "";
let promtScore = "";
let promptError = "";

const studyTopicFormOpt = formOptions({
  defaultValues: {
    topic: "",
    question: "",
  },
  validators: {
    onSubmitAsync: async ({
      value,
    }: {
      value: { topic: string; question: string };
    }) => {
      try {
        recievedQuestion = "";
        promptError = "";

        const output = await postPrompt(value.topic);
        if (output?.question) recievedQuestion = output.question;
        else if (output?.error) promptError = output.error;
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
        const output = await postAnswer({
          ...value,
          question: recievedQuestion,
        });

        if (output?.question) recievedQuestion = output.question;
        if (output?.feedback) promptResponse = output.feedback;
        if (output?.outcome) promtScore = output.outcome;
        if (output?.error) promptError = output.error;
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
                  className="w-80"
                  label="Generate study topic"
                />
              )}
            </studyTopicForm.AppField>
            <studyTopicForm.AppForm>
              <studyTopicForm.SubmitButton
                label="Generate"
                className="pt-2"
                btnStyle="text-center button-primary"
              />
            </studyTopicForm.AppForm>
          </form>
          <p className="text-red-800 text-sm font-bold">{promptError}</p>
          <p className="pt-3">{recievedQuestion}</p>
        </div>

        <div>
          <form
            onSubmit={(e) => {
              if (!studyTopicStore) return null;
              console.log("studyTopicStore ", studyTopicStore);
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
                  className="w-80 sm:h-80 h-60"
                />
              )}
            </answerForm.AppField>
            <answerForm.AppForm>
              <answerForm.SubmitButton
                label="Submit Answer"
                className="pt-2"
                btnStyle="text-center button-secondary"
              />
            </answerForm.AppForm>
          </form>
          <div className="font-bold pt-3">
            {promptResponse && (
              <span
                className={
                  promtScore === "pass" ? "text-green-600" : "text-red-600"
                }
              >
                {promtScore === "pass" ? "Correct: " : "Incorrect: "}
              </span>
            )}
            <span>{promptResponse}</span>
          </div>
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
