type RequestParams = Record<string, string | number | boolean | null | undefined>;

type RequestConfig = {
  params?: RequestParams;
};

type HttpResponse<T> = {
  data: T;
};

function buildUrl(path: string, params?: RequestParams) {
  const url = new URL(`/api${path}`, window.location.origin);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return `${url.pathname}${url.search}`;
}

async function request<T>(method: string, path: string, body?: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
  const headers = new Headers();
  const token = localStorage.getItem("accessToken");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const init: RequestInit = {
    method,
    headers,
    credentials: "include"
  };

  if (body instanceof FormData) {
    init.body = body;
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    init.body = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path, config?.params), init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      typeof data?.message === "string" ? data.message : `Request failed with ${response.status}`;
    throw new Error(message);
  }

  return { data: data as T };
}

export const http = {
  get: <T>(path: string, config?: RequestConfig) => request<T>("GET", path, undefined, config),
  post: <T>(path: string, body?: unknown, config?: RequestConfig) => request<T>("POST", path, body, config)
};
