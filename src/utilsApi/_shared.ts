import { cookies } from "next/headers";

const TOKEN_NAME = "nuach";

type fetchT = {
  method: "get" | "post" | "patch";
  isCached: boolean;
  route: string;
};

export const getRootUrl = () => {
  const devUrl = process.env.DEV_SERVER_URL;
  const prodUrl = process.env.PROD_SERVER_URL;
  const env = process.env.NEXT_PUBLIC_NUACH_ENV;

  return env?.toLowerCase() === "dev" ? devUrl : prodUrl;
};

export const fetchConfig = async (props: fetchT) => {
  const { method, route, isCached } = props;

  const securityUser = process.env.SECURITY_USER;
  const securityPassword = process.env.SECURITY_PASSWORD;

  const cacheKey = `${method}-${route}`;
  const cookieStore = await cookies();
  const nuachToken = cookieStore.get(TOKEN_NAME)?.value;

  return {
    mode: "cors",
    method: method.toUpperCase(),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      Origin: getRootUrl(),
      Authorization: `Basic ${btoa(`${securityUser}:${securityPassword}`)}`,
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
