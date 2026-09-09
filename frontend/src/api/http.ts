type RequestParams = Record<string, string | number | boolean | null | undefined>;

type RequestConfig = {
  params?: RequestParams;
};

type HttpResponse<T> = {
  data: T;
};

type RefreshResponse = {
  data?: {
    accessToken?: unknown;
  } | null;
};

let refreshPromise: Promise<string | null> | null = null;

function buildUrl(path: string, params?: RequestParams) {
  const url = new URL(`/api${path}`, window.location.origin);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return `${url.pathname}${url.search}`;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  config?: RequestConfig,
  retryAfterRefresh = true
): Promise<HttpResponse<T>> {
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

  if (response.status === 401 && retryAfterRefresh && !path.startsWith("/auth/")) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      return request<T>(method, path, body, config, false);
    }
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      response.status === 401
        ? "Session expired. Please log in again."
        : typeof data?.message === "string"
          ? data.message
          : `Request failed with ${response.status}`;
    throw new Error(message);
  }

  return { data: data as T };
}

function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include"
  })
    .then(async (response) => {
      const payload = await response.json() as RefreshResponse;
      const accessToken = payload.data?.accessToken;
      if (!response.ok || typeof accessToken !== "string" || !accessToken) {
        localStorage.removeItem("accessToken");
        return null;
      }
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    })
    .catch(() => {
      localStorage.removeItem("accessToken");
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export const http = {
  get: <T>(path: string, config?: RequestConfig) => request<T>("GET", path, undefined, config),
  post: <T>(path: string, body?: unknown, config?: RequestConfig) => request<T>("POST", path, body, config),
  patch: <T>(path: string, body?: unknown, config?: RequestConfig) => request<T>("PATCH", path, body, config)
};
