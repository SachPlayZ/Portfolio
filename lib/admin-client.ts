type AdminRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

export async function adminRequest<T>(
  url: string,
  { method = "GET", body, headers }: AdminRequestOptions = {}
): Promise<T> {
  const init: RequestInit = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body instanceof FormData) {
    delete (init.headers as Record<string, string>)["Content-Type"];
    init.body = body;
  } else if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(url, init);
  let payload: any = null;

  try {
    payload = await response.json();
  } catch {
    // Ignore json parsing for empty bodies
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.message ||
      `Request to ${url} failed with ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export function buildQuery(
  base: string,
  params: Record<string, string | undefined | null>
) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.append(key, value);
  });
  const query = search.toString();
  return query ? `${base}?${query}` : base;
}

