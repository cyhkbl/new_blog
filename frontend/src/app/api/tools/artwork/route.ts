import { fetchWithTimeout } from "@/lib/remote";

export const dynamic = "force-dynamic";

const ALLOWED_DOMAINS = ["mzstatic.com", "lrclib.net"];

function isAllowed(hostname: string): boolean {
  return ALLOWED_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src");

  if (!src) {
    return new Response("missing src", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return new Response("bad src", { status: 400 });
  }

  if (target.protocol !== "https:" || !isAllowed(target.hostname)) {
    return new Response("domain not allowed", { status: 403 });
  }

  try {
    const res = await fetchWithTimeout(target.toString(), {}, 10000);
    const contentType = res.headers.get("content-type") ?? "";

    if (!res.ok || !contentType.startsWith("image/")) {
      return new Response("upstream error", { status: 502 });
    }

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength > 8 * 1024 * 1024) {
      return new Response("too large", { status: 413 });
    }

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    console.error("artwork proxy failed", error);
    return new Response("upstream unavailable", { status: 502 });
  }
}
