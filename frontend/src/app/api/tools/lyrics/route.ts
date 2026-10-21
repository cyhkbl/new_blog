import { NextResponse } from "next/server";

import { fetchWithTimeout } from "@/lib/remote";

export const dynamic = "force-dynamic";

type LrclibItem = {
  trackName?: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  instrumental?: boolean;
  plainLyrics?: string | null;
  syncedLyrics?: string | null;
};

function fromSynced(synced: string): string {
  return synced
    .split("\n")
    .map((line) => line.replace(/^\[[^\]]*\]/g, "").trim())
    .filter((line, index, arr) => line !== "" || arr[index - 1] !== "")
    .join("\n");
}

function pickLyrics(items: LrclibItem[]): string | null {
  for (const item of items) {
    if (item.instrumental) continue;
    if (item.plainLyrics && item.plainLyrics.trim()) return item.plainLyrics;
    if (item.syncedLyrics && item.syncedLyrics.trim()) {
      return fromSynced(item.syncedLyrics);
    }
  }
  return null;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const title = params.get("title")?.trim() ?? "";
  const artist = params.get("artist")?.trim() ?? "";
  const album = params.get("album")?.trim() ?? "";
  const duration = params.get("duration")?.trim() ?? "";

  if (!title && !artist) {
    return NextResponse.json({ lyrics: null }, { status: 400 });
  }

  try {
    if (title && artist) {
      const exact = await fetchWithTimeout(
        "https://lrclib.net/api/get?" +
          new URLSearchParams({
            track_name: title,
            artist_name: artist,
            ...(album ? { album_name: album } : {}),
            ...(duration ? { duration } : {}),
          }).toString()
      );

      if (exact.ok) {
        const item = (await exact.json()) as LrclibItem;
        const lyrics = pickLyrics([item]);
        if (lyrics) return NextResponse.json({ lyrics });
      }
    }

    const search = await fetchWithTimeout(
      "https://lrclib.net/api/search?" +
        new URLSearchParams({
          ...(title ? { track_name: title } : {}),
          ...(artist ? { artist_name: artist } : {}),
        }).toString()
    );

    if (!search.ok) throw new Error(`lrclib ${search.status}`);

    const items = (await search.json()) as LrclibItem[];
    const lyrics = pickLyrics(Array.isArray(items) ? items : []);

    return NextResponse.json({ lyrics });
  } catch (error) {
    console.error("lyrics lookup failed", error);
    return NextResponse.json({
      lyrics: null,
      error: "没找到歌词，手动粘贴一份就好。",
    });
  }
}
