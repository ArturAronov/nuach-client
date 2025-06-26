"use server";

import { fetchConfig, getRootUrl } from "./_shared";

export const postPrompt = async (
  prompt: string,
): Promise<Record<"question" | "error", string> | null> => {
  console.log("Sending postPrompt: ", prompt);

  try {
    const route = "/v1/quiz/request-question";
    const url = getRootUrl() + route;
    const fetchObj = await fetchConfig({
      method: "get",
      isCached: false,
      route: route,
    });

    const response = await fetch(`${url}/?query=${prompt}`, {
      ...fetchObj,
    })
      .then((res) => res.text())
      .then((text) => JSON.parse(text));

    return response;
  } catch (err) {
    console.error("Error in postPrompt: ", err);
    return null;
  }
};
