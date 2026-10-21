export const REMOTE_UA =
  "cyhkbl-blog-tools/1.0 (+https://cyhkbl.qzz.io)";

export async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
      headers: { "User-Agent": REMOTE_UA, ...(init.headers ?? {}) },
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}
