"use server";

import { fetchConfig, getRootUrl } from "./_shared";

type bodyT = {
  topic: string;
  answer: string;
  question: string;
};

type outputT = {
  feedback?: string;
  outcome?: string;
  error?: string;
  question: string;
};

export const postAnswer = async (body: bodyT): Promise<outputT | null> => {
  console.log("Sending postAnswer: ", body);

  try {
    const route = "/v1/quiz/submit-answer/";
    const url = getRootUrl() + route;
    const fetchObj = await fetchConfig({
      method: "post",
      isCached: false,
      route,
    });

    const response = await fetch(url, {
      ...fetchObj,
      body: JSON.stringify(body),
    })
      .then((res) => res.text())
      .then((text) => {
        const data = JSON.parse(text);
        let output = { question: "" } satisfies Partial<outputT>;

        if (data.feedback) output = { ...JSON.parse(data.feedback) };
        if (data.question) output = { ...output, ...JSON.parse(data.question) };

        return output;
      });

    return response;
  } catch (err) {
    console.error("Error in postAnswer: ", err);
    return null;
  }
};
