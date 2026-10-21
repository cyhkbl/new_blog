"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  duration: number;
};

type Settings = {
  ratio: string;
  layout: "stack" | "side" | "text";
  useCoverBg: boolean;
  blur: number;
  bgAlpha: number;
  radius: number;
  font: "serif" | "sans";
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  platform: string;
  showMeta: boolean;
  theme: string;
};

const RATIOS = [
  { key: "4:5", label: "4:5", width: 1080, height: 1350 },
  { key: "1:1", label: "1:1", width: 1080, height: 1080 },
  { key: "3:4", label: "3:4", width: 1080, height: 1440 },
  { key: "9:16", label: "9:16", width: 1080, height: 1920 },
];

const LAYOUTS: { key: Settings["layout"]; label: string }[] = [
  { key: "stack", label: "封面在上" },
  { key: "side", label: "封面在左" },
  { key: "text", label: "纯歌词" },
];

const THEMES = [
  { key: "midnight", label: "午夜蓝", from: "#161726", to: "#312444" },
  { key: "forest", label: "松林", from: "#101d18", to: "#22402f" },
  { key: "dusk", label: "黄昏", from: "#2a1620", to: "#4a2b25" },
  { key: "ink", label: "墨黑", from: "#0d0d10", to: "#242430" },
];

const PLATFORMS = ["", "Spotify", "Apple Music", "网易云音乐"];

const FONT_STACK: Record<Settings["font"], string> = {
  serif: '"SimSun","Songti SC","STSong","Noto Serif SC",serif',
  sans: '"PingFang SC","Microsoft YaHei","Helvetica Neue",Arial,sans-serif',
};

const DEFAULT_SETTINGS: Settings = {
  ratio: "4:5",
  layout: "stack",
  useCoverBg: true,
  blur: 18,
  bgAlpha: 100,
  radius: 24,
  font: "serif",
  fontSize: 56,
  letterSpacing: 0,
  lineHeight: 150,
  platform: "Spotify",
  showMeta: true,
  theme: "midnight",
};

const SAMPLE_LYRICS = `就让我沉入这场雨里
把没说完的话交给风
你在城市的另一边
是否也听见同一首歌`;

const META_PATTERNS = [
  /^(作词|作曲|编曲|词|曲|演唱|原唱|制作|混音|母带|监制|出品|Lyrics?|Composer|Producer|Arranger)\s*[:：]/i,
  /^.{1,20}\s+-\s+.{1,20}$/,
  /^\[[^\]]*\]$/,
];

// 歌词文件开头常带「歌手 - 歌名」「词：某某」这类信息，默认不要选进来。
function pickDefaultLines(lines: string[]): number[] {
  const picked = lines
    .map((line, index) => ({ line: line.trim(), index }))
    .filter(({ line }) => line && !META_PATTERNS.some((pattern) => pattern.test(line)))
    .slice(0, 4)
    .map(({ index }) => index);

  if (picked.length) return picked;
  return lines.map((_, index) => index).slice(0, 4);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxWidth: number
): string[] {
  const out: string[] = [];
  for (const raw of lines) {
    const text = raw.trim();
    if (!text) {
      out.push("");
      continue;
    }
    let current = "";
    for (const char of Array.from(text)) {
      const next = current + char;
      if (ctx.measureText(next).width > maxWidth && current) {
        out.push(current);
        current = char;
      } else {
        current = next;
      }
    }
    if (current) out.push(current);
  }
  return out;
}

type PosterOptions = {
  width: number;
  height: number;
  settings: Settings;
  cover: HTMLImageElement | null;
  title: string;
  artist: string;
  lines: string[];
};

function drawPoster(ctx: CanvasRenderingContext2D, options: PosterOptions) {
  const { width, height, settings, cover, title, artist, lines } = options;
  const scale = width / 1080;
  const pad = 84 * scale;
  const theme = THEMES.find((item) => item.key === settings.theme) ?? THEMES[0];

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);

  if (cover && settings.useCoverBg) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, settings.bgAlpha / 100));
    const blurPx = settings.blur * scale;
    if (blurPx > 0) ctx.filter = `blur(${blurPx}px)`;
    const bleed = 0.1;
    drawImageCover(
      ctx,
      cover,
      -width * bleed,
      -height * bleed,
      width * (1 + bleed * 2),
      height * (1 + bleed * 2)
    );
    ctx.filter = "none";
    ctx.restore();
  } else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, theme.from);
    gradient.addColorStop(1, theme.to);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  const scrim = ctx.createLinearGradient(0, 0, 0, height);
  scrim.addColorStop(0, "rgba(0,0,0,0.16)");
  scrim.addColorStop(0.45, "rgba(0,0,0,0.34)");
  scrim.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, width, height);

  const hasCover = !!cover && settings.layout !== "text";
  let coverSize = 0;
  let coverX = pad;
  let coverY = pad;

  if (hasCover && settings.layout === "stack") {
    coverSize = Math.min(width - pad * 2, height * 0.42);
    coverX = (width - coverSize) / 2;
    coverY = pad;
  } else if (hasCover) {
    coverSize = Math.min(width * 0.3, 300 * scale);
    coverX = pad;
    coverY = pad;
  }

  if (hasCover && cover) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 48 * scale;
    ctx.shadowOffsetY = 20 * scale;
    roundRect(ctx, coverX, coverY, coverSize, coverSize, settings.radius * scale);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    roundRect(ctx, coverX, coverY, coverSize, coverSize, settings.radius * scale);
    ctx.clip();
    drawImageCover(ctx, cover, coverX, coverY, coverSize, coverSize);
    ctx.restore();
  }

  const footerHeight = settings.showMeta ? 108 * scale : 0;
  const footerTop = height - pad - footerHeight;

  let areaX = pad;
  let areaY = pad;
  let areaW = width - pad * 2;
  const areaBottom = footerTop - 24 * scale;

  if (settings.layout === "stack" && hasCover) {
    areaY = coverY + coverSize + 56 * scale;
  } else if (settings.layout === "side" && hasCover) {
    areaX = coverX + coverSize + 40 * scale;
    areaW = width - pad - areaX;
    areaY = pad;
  } else if (settings.layout === "text") {
    areaY = pad * 1.4;
  }

  const areaH = Math.max(40, areaBottom - areaY);
  const baseSize = settings.fontSize * scale;
  const fontFamily = FONT_STACK[settings.font];
  const spacing = settings.letterSpacing * scale;
  const lineHeightPct = settings.lineHeight / 100;

  let fontSize = baseSize;
  let wrapped: string[] = [];
  const minSize = 14 * scale;

  for (; fontSize >= minSize; fontSize -= 2 * scale) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.letterSpacing = `${spacing}px`;
    wrapped = wrapText(ctx, lines.length ? lines : [" "], areaW);
    if (wrapped.length * fontSize * lineHeightPct <= areaH) break;
  }

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.letterSpacing = `${spacing}px`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  const lineHeight = fontSize * lineHeightPct;
  const textHeight = wrapped.length * lineHeight;
  const centerOffset = Math.max(0, (areaH - textHeight) / 2);

  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 18 * scale;
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  wrapped.forEach((line, index) => {
    ctx.fillText(line, areaX, areaY + centerOffset + index * lineHeight);
  });
  ctx.shadowBlur = 0;

  if (settings.showMeta) {
    const metaY = footerTop + 18 * scale;

    if (settings.layout === "side" && hasCover) {
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = `600 ${26 * scale}px ${fontFamily}`;
      ctx.letterSpacing = "0px";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      const metaX = coverX + coverSize / 2;
      const metaWidth = coverSize;
      const titleLine = wrapText(ctx, [title || "未命名"], metaWidth)[0] ?? "";
      ctx.fillText(titleLine, metaX, footerTop + 10 * scale);
      ctx.font = `${20 * scale}px ${fontFamily}`;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      const artistLine = wrapText(ctx, [artist || ""], metaWidth)[0] ?? "";
      ctx.fillText(artistLine, metaX, footerTop + 46 * scale);
      ctx.textAlign = "left";
    } else {
      ctx.font = `600 ${28 * scale}px ${fontFamily}`;
      ctx.letterSpacing = "0px";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText(title || "未命名", areaX, metaY);

      ctx.font = `${21 * scale}px ${fontFamily}`;
      ctx.fillStyle = "rgba(255,255,255,0.68)";
      ctx.fillText(artist || "", areaX, metaY + 40 * scale);
    }
  }

  if (settings.platform) {
    const pillH = 44 * scale;
    const pillY = settings.showMeta
      ? footerTop + footerHeight - pillH - 8 * scale
      : height - pad - pillH;
    ctx.font = `500 ${21 * scale}px ${FONT_STACK.sans}`;
    ctx.letterSpacing = "0px";
    const textWidth = ctx.measureText(settings.platform).width;
    const pillW = textWidth + 40 * scale;
    const pillX = width - pad - pillW;

    ctx.save();
    roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.textBaseline = "middle";
    ctx.fillText(settings.platform, pillX + 20 * scale, pillY + pillH / 2 + 1 * scale);
  }

  ctx.letterSpacing = "0px";
  ctx.restore();
}

export default function LyricPost() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [track, setTrack] = useState<Track | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [lyrics, setLyrics] = useState(SAMPLE_LYRICS);
  const [selected, setSelected] = useState<number[]>([0, 1, 2, 3]);
  const [lyricsStatus, setLyricsStatus] = useState("");
  const [loadedCover, setLoadedCover] = useState<{
    src: string;
    image: HTMLImageElement;
  } | null>(null);
  const [customCover, setCustomCover] = useState<string>("");
  const [exporting, setExporting] = useState(false);

  const coverSrc = customCover
    ? customCover
    : track?.artwork
      ? `/api/tools/artwork?src=${encodeURIComponent(track.artwork)}`
      : "";
  const coverImage = loadedCover?.src === coverSrc ? loadedCover.image : null;

  const ratio = useMemo(
    () => RATIOS.find((item) => item.key === settings.ratio) ?? RATIOS[0],
    [settings.ratio]
  );

  const allLines = useMemo(
    () =>
      lyrics
        .split("\n")
        .map((line) => line.replace(/\s+$/, ""))
        .filter((line, index, arr) => line.trim() !== "" || arr[index - 1] !== ""),
    [lyrics]
  );

  const activeLines = useMemo(
    () =>
      selected
        .slice()
        .sort((a, b) => a - b)
        .map((index) => allLines[index] ?? "")
        .filter((line) => line.trim() !== ""),
    [selected, allLines]
  );

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (!coverSrc) return;

    let alive = true;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (alive) setLoadedCover({ src: coverSrc, image });
    };
    image.src = coverSrc;

    return () => {
      alive = false;
    };
  }, [coverSrc]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = ratio.width;
    canvas.height = ratio.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawPoster(ctx, {
      width: ratio.width,
      height: ratio.height,
      settings,
      cover: coverImage,
      title,
      artist,
      lines: activeLines,
    });
  }, [ratio, settings, coverImage, title, artist, activeLines]);

  useEffect(() => {
    render();
  }, [render]);

  async function search() {
    const term = query.trim();
    if (!term) return;
    setSearching(true);
    setSearchError("");
    try {
      const res = await fetch(`/api/tools/music?q=${encodeURIComponent(term)}`);
      const data = (await res.json()) as { results?: Track[]; error?: string };
      setResults(data.results ?? []);
      if (data.error) setSearchError(data.error);
      else if (!data.results?.length) setSearchError("没有搜到，换个关键词试试。");
    } catch {
      setSearchError("搜索请求失败，可以直接写歌名和歌词。");
    } finally {
      setSearching(false);
    }
  }

  async function chooseTrack(item: Track) {
    setTrack(item);
    setTitle(item.title);
    setArtist(item.artist);
    setResults([]);
    setLyricsStatus("正在找歌词…");

    try {
      const params = new URLSearchParams({
        title: item.title,
        artist: item.artist,
        ...(item.album ? { album: item.album } : {}),
        ...(item.duration ? { duration: String(item.duration) } : {}),
      });
      const res = await fetch(`/api/tools/lyrics?${params.toString()}`);
      const data = (await res.json()) as { lyrics?: string | null };
      if (data.lyrics) {
        const text = data.lyrics.trim();
        setLyrics(text);
        setSelected(pickDefaultLines(text.split("\n")));
        setLyricsStatus("已填好歌词，可以挑选要出现在卡片上的句子。");
      } else {
        setLyricsStatus("没找到歌词，手动粘贴一份就可以。");
      }
    } catch {
      setLyricsStatus("歌词接口暂时不可用，手动粘贴一份就可以。");
    }
  }

  function toggleLine(index: number) {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    );
  }

  function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setCustomCover(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function exportImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    canvas.toBlob((blob) => {
      setExporting(false);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const name = (title || "lyric").replace(/[\\/:*?"<>|]/g, "_");
      link.href = url;
      link.download = `${name}-歌词卡片.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, "image/png");
  }

  const sliderClass =
    "h-1.5 w-full appearance-none rounded-full bg-black/10 accent-[var(--text-primary)]";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="space-y-5">
        <section className="glass p-5">
          <h2 className="text-base font-semibold">1. 找一首歌</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            搜索只用来拿封面的颜色和歌词。搜不到也没关系，下面都能手填。
          </p>
          <div className="mt-3 flex gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void search();
              }}
              placeholder="歌名或歌手，例如 晴天 周杰伦"
              className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none focus:border-black/25"
            />
            <button
              type="button"
              onClick={() => void search()}
              disabled={searching}
              className="rounded-xl bg-[var(--text-primary)] px-4 py-2 text-sm text-white transition disabled:opacity-50">
              {searching ? "搜索中" : "搜索"}
            </button>
          </div>
          {searchError && (
            <p className="mt-2 text-xs text-[var(--text-secondary)]">{searchError}</p>
          )}
          {results.length > 0 && (
            <ul className="mt-3 max-h-56 space-y-1 overflow-auto pr-1">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => void chooseTrack(item)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-black/5">
                    <img
                      src={`/api/tools/artwork?src=${encodeURIComponent(item.artwork)}`}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-10 w-10 flex-none rounded-lg object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{item.title}</span>
                      <span className="block truncate text-xs text-[var(--text-secondary)]">
                        {item.artist}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass p-5">
          <h2 className="text-base font-semibold">2. 选歌词</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            一行一句。点下面的句子可以加上或去掉，按顺序排进卡片。
          </p>
          <textarea
            value={lyrics}
            onChange={(event) => {
              setLyrics(event.target.value);
              setLyricsStatus("");
            }}
            rows={5}
            className="mt-3 w-full resize-y rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm leading-6 outline-none focus:border-black/25"
            placeholder="把歌词粘在这里，一行一句"
          />
          {lyricsStatus && (
            <p className="mt-2 text-xs text-[var(--text-secondary)]">{lyricsStatus}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {allLines.map((line, index) => {
              const active = selected.includes(index);
              return (
                <button
                  key={`${index}-${line.slice(0, 6)}`}
                  type="button"
                  onClick={() => toggleLine(index)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    active
                      ? "border-black/20 bg-black/85 text-white"
                      : "border-black/10 bg-white/60 text-[var(--text-secondary)] hover:border-black/25"
                  }`}>
                  {line.trim() || "（空行）"}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex gap-3 text-xs text-[var(--text-secondary)]">
            <button
              type="button"
              onClick={() => setSelected(allLines.map((_, index) => index))}
              className="underline underline-offset-4">
              全选
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="underline underline-offset-4">
              清空
            </button>
            <span>已选 {selected.length} 行</span>
          </div>
        </section>

        <section className="glass p-5">
          <h2 className="text-base font-semibold">3. 调样式</h2>

          <div className="mt-3 space-y-4">
            <div>
              <span className="text-xs text-[var(--text-secondary)]">尺寸</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {RATIOS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => update("ratio", item.key)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      settings.ratio === item.key
                        ? "border-black/20 bg-black/85 text-white"
                        : "border-black/10 bg-white/60 text-[var(--text-secondary)]"
                    }`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-[var(--text-secondary)]">版式</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {LAYOUTS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => update("layout", item.key)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      settings.layout === item.key
                        ? "border-black/20 bg-black/85 text-white"
                        : "border-black/10 bg-white/60 text-[var(--text-secondary)]"
                    }`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-[var(--text-secondary)]">字体</span>
                <select
                  value={settings.font}
                  onChange={(event) =>
                    update("font", event.target.value as Settings["font"])
                  }
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-2 py-1.5 text-xs">
                  <option value="serif">宋体</option>
                  <option value="sans">黑体</option>
                </select>
              </div>
              <div>
                <span className="text-xs text-[var(--text-secondary)]">平台标签</span>
                <select
                  value={settings.platform}
                  onChange={(event) => update("platform", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-2 py-1.5 text-xs">
                  {PLATFORMS.map((item) => (
                    <option key={item || "none"} value={item}>
                      {item || "不显示"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <span className="text-xs text-[var(--text-secondary)]">底图</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {THEMES.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => update("theme", item.key)}
                    disabled={settings.useCoverBg}
                    className={`rounded-full border px-3 py-1 text-xs transition disabled:opacity-40 ${
                      settings.theme === item.key
                        ? "border-black/20 bg-black/85 text-white"
                        : "border-black/10 bg-white/60 text-[var(--text-secondary)]"
                    }`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {[
              { key: "fontSize" as const, label: "字号", min: 24, max: 96, unit: "px" },
              { key: "lineHeight" as const, label: "行距", min: 110, max: 220, unit: "%" },
              { key: "letterSpacing" as const, label: "字间距", min: 0, max: 10, unit: "px" },
              { key: "radius" as const, label: "圆角", min: 0, max: 64, unit: "px" },
              { key: "blur" as const, label: "模糊", min: 0, max: 48, unit: "px" },
              { key: "bgAlpha" as const, label: "底图不透明度", min: 0, max: 100, unit: "%" },
            ].map(({ key, label, min, max, unit }) => (
              <label key={key} className="block">
                <span className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>{label}</span>
                  <span>
                    {settings[key]}
                    {unit}
                  </span>
                </span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={settings[key]}
                  onChange={(event) => update(key, Number(event.target.value))}
                  className={`mt-1 ${sliderClass}`}
                />
              </label>
            ))}

            <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.useCoverBg}
                  onChange={(event) => update("useCoverBg", event.target.checked)}
                />
                用封面当底图
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showMeta}
                  onChange={(event) => update("showMeta", event.target.checked)}
                />
                显示歌名歌手
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-[var(--text-secondary)]">
                歌名
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-2 py-1.5 text-sm text-[var(--text-primary)]"
                  placeholder="未命名"
                />
              </label>
              <label className="block text-xs text-[var(--text-secondary)]">
                歌手
                <input
                  value={artist}
                  onChange={(event) => setArtist(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-2 py-1.5 text-sm text-[var(--text-primary)]"
                  placeholder="歌手名"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
              <label className="cursor-pointer rounded-lg border border-black/10 bg-white/60 px-3 py-1.5 transition hover:border-black/25">
                上传封面
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
              {customCover && (
                <button
                  type="button"
                  onClick={() => setCustomCover("")}
                  className="underline underline-offset-4">
                  用回歌曲封面
                </button>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="glass overflow-hidden p-3">
          <canvas
            ref={canvasRef}
            className="w-full rounded-2xl bg-black/80"
            style={{ aspectRatio: `${ratio.width} / ${ratio.height}` }}
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={exportImage}
              disabled={exporting}
              className="flex-1 rounded-xl bg-[var(--text-primary)] px-4 py-2 text-sm text-white transition disabled:opacity-50">
              {exporting ? "生成中…" : "下载 PNG"}
            </button>
            <button
              type="button"
              onClick={() => setSettings(DEFAULT_SETTINGS)}
              className="rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:border-black/25">
              重置
            </button>
          </div>
          <p className="mt-2 px-1 text-xs text-[var(--text-secondary)]">
            导出的图片是 {ratio.width} × {ratio.height} 像素的 PNG。
          </p>
        </div>
      </div>
    </div>
  );
}
