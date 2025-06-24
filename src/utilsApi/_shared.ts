import { cookies } from "next/headers";

const TOKEN_NAME = "nuach";

type fetchT = {
  method: "get" | "post";
  isCached: boolean;
  route: string;
};

export const getRootUrl = () => {
  const devUrl = process.env.DEV_SERVER_URL;
  const prodUrl = process.env.PROD_SERVER_URL;
  const env = process.env.NEXT_PUBLIC_NUACH_ENV;

  if (!devUrl) throw Error("Can't find env DEV_SERVER_URL");
  if (!prodUrl) throw Error("Can't find env PROD_SERVER_URL");

  return env?.toLowerCase() === "dev" ? devUrl : prodUrl;
};

export const fetchConfig = async (props: fetchT): Promise<RequestInit> => {
  const { method, route, isCached } = props;
  const cacheKey = `${method}-${route}`;
  const cookieStore = await cookies();
  const nuachToken = cookieStore.get(TOKEN_NAME)?.value;

  return {
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      Origin: getRootUrl(),
      ...(nuachToken && { Cookie: `${TOKEN_NAME}=${nuachToken}` }),
    },
    ...(isCached && {
      next: {
        revalidate: 300,
        tags: [cacheKey],
      },
    }),
  };
};

export const cookieSetter = async (response: Response) => {
  const setCookieHeader = response.headers.get("set-cookie");

  if (setCookieHeader) {
    const regex = new RegExp(`${TOKEN_NAME}=([^;]+)`);
    const sessionCookie = setCookieHeader.match(regex);

    if (sessionCookie) {
      const tokenValue = sessionCookie[1];
      const cookieStore = await cookies();

      cookieStore.set(TOKEN_NAME, tokenValue, {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_NUACH_ENV !== "dev",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }
  }
};
