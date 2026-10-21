import { NextResponse } from "next/server";

import { fetchWithTimeout } from "@/lib/remote";

export const dynamic = "force-dynamic";

type ItunesTrack = {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
  trackTimeMillis?: number;
};

type SearchResult = {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  duration: number;
};

// Apple 的中国区店面不给公开搜索接口返回结果，中文歌在港台店面能搜到，
// 英文歌在美国店面更全，所以三个店面一起查再合并。
const STOREFRONTS = [
  { country: "HK", lang: "zh_hk" },
  { country: "TW", lang: "zh_tw" },
  { country: "US", lang: "en_us" },
];

async function searchStorefront(
  term: string,
  storefront: { country: string; lang: string }
): Promise<SearchResult[]> {
  const url =
    "https://itunes.apple.com/search?" +
    new URLSearchParams({
      term,
      entity: "song",
      limit: "8",
      country: storefront.country,
      lang: storefront.lang,
    }).toString();

  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`itunes ${storefront.country} ${res.status}`);

  const data = (await res.json()) as { results?: ItunesTrack[] };

  return (data.results ?? [])
    .filter((item) => item.trackName && item.artistName)
    .map((item) => ({
      id: String(item.trackId ?? `${item.trackName}-${item.artistName}`),
      title: item.trackName as string,
      artist: item.artistName as string,
      album: item.collectionName ?? "",
      artwork: (item.artworkUrl100 ?? "").replace("100x100bb", "600x600bb"),
      duration: Math.round((item.trackTimeMillis ?? 0) / 1000),
    }));
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const settled = await Promise.allSettled(
    STOREFRONTS.map((storefront) => searchStorefront(q, storefront))
  );

  const merged: SearchResult[] = [];
  const seen = new Set<string>();

  for (const outcome of settled) {
    if (outcome.status !== "fulfilled") continue;
    for (const item of outcome.value) {
      const key = `${item.title.toLowerCase()}|${item.artist.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }

  if (merged.length > 0) {
    return NextResponse.json({ results: merged.slice(0, 12) });
  }

  const allFailed = settled.every((outcome) => outcome.status === "rejected");

  return NextResponse.json({
    results: [],
    error: allFailed
      ? "搜索接口暂时不通，直接写歌名和歌词就行。"
      : "没搜到，换个关键词，或者直接手填。",
  });
}
