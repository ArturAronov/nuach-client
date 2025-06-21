"use server";

import { fetchConfig, getRootUrl } from "./_shared";

export type signInT = {
  email: string;
  password: string;
};

// export const postSignIn = cache(async (body: signInT): Promise<void | null> => {
export const postPrompt = async (body: signInT): Promise<void | null> => {
  console.log("Sending postPrompt: ", body);

  try {
    const route = "/v1/request-question";
    const url = getRootUrl() + route;
    const response = await fetch(url, {
      ...fetchConfig({ method: "post", isCached: false, route: route }),
      method: "post",
      body: JSON.stringify(body),
    });

    console.log(response);
    // return response;
  } catch (err) {
    console.error("Error in postPrompt: ", err);
    return null;
  }
};
