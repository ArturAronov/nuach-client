"use server";

import { fetchConfig, getRootUrl } from "./_shared";

export const postPrompt = async (prompt: string): Promise<string | null> => {
  console.log("Sending postPrompt: ", prompt);

  try {
    const route = "/v1/quiz/request-question";
    const url = getRootUrl() + route;
    const fetchObj = await fetchConfig({
      method: "post",
      isCached: false,
      route: route,
    });

    const response = await fetch(url, {
      ...fetchObj,
      body: JSON.stringify({
        prompt,
        stream: false,
        model: "llama3.2",
      }),
    }).then((res) => res.text());

    return response;
  } catch (err) {
    console.error("Error in postPrompt: ", err);
    return null;
  }
};
