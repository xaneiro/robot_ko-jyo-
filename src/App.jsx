import { useEffect, useMemo, useRef, useState } from "react";

import "./styles.css";

const FILES = [
  "00メカニカルガール足立.png",
  "01イェーイ足立.png",
  "02美味しくなーれ！.png",
  "03ワクワク.png",
  "04セクシー足立.png",
  "05スンッ….png",
  "06ニコーー.png",
  "07バッター足立.png",
  "08ばいばーい足立.png",
  "09モデルさん足立.png",
  "10歌う足立.png",
  "11ぬき.png",
  "12足(右).png",
  "13さし.png",
  "14足(左).png",
  "15走り足立1.png",
  "16走り足立2.png",
  "17走り足立3.png",
  "18走り足立4.png",
  "19うわっ！.png",
  "20あいたたた….png",
  "21そいやっそいやっ.png",
  "22どっせいどっせい.png",
  "23ぽっぴぽっぴぽっぽっぴっぽー右足立.png",
  "24ぽっぴぽっぴぽっぽっぴっぽー左足立.png",
  "25いくぞ～.png",
  "26波動拳！.png",
  "27あれれ.png",
  "28あれれれ….png",
  "29あらららら….png",
  "30こっちの方がいいかな.png",
  "31これか？.png",
  "32これかぁ～？.png",
  "33これもいいなぁ.png",
  "34足立はダンスにハマってる？.png",
  "35充電中足立.png",
  "36あれ？さっきまでここに…どこ行った？.png",
  "37そこどこ？.png",
  "38そこそこ遠…トホホ.png",
  "39幕引きだ！.png",
  "40しゃがみ足立.png",
  "41スピニングバードキック！.png",
  "42畳み掛ける！.png",
  "43ヨガフロート足立.png",
  "44待ち足立.png",
  "45立ち強p足立.png",
  "46荒ぶる鷹の足立.png",
  "47YO! SAY夏が胸を刺激する足立.png",
  "48アン＝ダン＝チ＝レイ.png",
  "48サボテンダー足立.png",
  "49うんちつんつん足立.png",
  "49ロケット足立.png",
  "50ライトニング・ボルト足立.png",
  "51あ…あの奇天烈な動き…！.png",
  "52あなた.png",
  "53スパイダー足立.png",
  "54Wide Adachi Walking.png",
  "55空N足立.png",
  "56岐阜の足立.png",
  "57ホッ！ハッ！ヤッ！.png",
  "58ふーん…ワクワク….png",
  "59ﾚｲﾀﾞﾖｰ.png",
  "60首狩り族右足立.png",
  "61首狩り族左足立.png",
  "62────という事なんですが…….png",
  "62ああいあうあえあおあんいいういえいおいんううえうおうんええおえんおおんん.wav.png",
  "63引きこもり絶対ジャスティス足立.png",
  "64パーティションはないない足立.png",
  "65わたしにも血液はあります.png",
  "66外出た瞬間終わった足立.png",
  "67朝まで寝よーーーーーーーーっと！！.png",
  "68鳴り止まないこの音楽を…….png",
  "69日進月歩遭難中.png",
  "70別に食べれないことないけどさ.png",
  "71『とりま聞こう？』.png",
  "72目新しい音探して三千里.png",
  "73「今日は一日雨ですね」.png",
  "74管理・処理室.png",
  "75素材テストで出力された個体.png",
  "76固定ミスでずれて出力された個体.png",
  "77フィラメント残量切れで途中までしか出力されなかった個体.png",
  "78君の幸運を祈る.png",
  "79変わった人間もいるんですね.png",
];

const STORAGE_KEY = "robot_kojyo_stamp_studio_v2";
const BOARD_ASPECT_RATIO = 4 / 3;
const EXPORT_WIDTH = 1600;
const EXPORT_HEIGHT = Math.round(EXPORT_WIDTH / BOARD_ASPECT_RATIO);
const DEFAULT_SIZE = 180;
const CUSTOM_BACKGROUND_ID = "custom";
const BGM_SRC = "/bgm/bgm3.mp3";
const DEFAULT_BGM_VOLUME = 0.42;
const DEFAULT_SE_VOLUME = 0.68;
const COMPACT_LANDSCAPE_QUERY =
  "(hover: none) and (pointer: coarse) and (orientation: landscape) and (max-width: 960px) and (max-height: 600px)";
const COMPACT_LANDSCAPE_STAMP_SCALE = 0.52;

const BACKGROUNDS = [
  { id: "plain", label: "白紙", note: "まっしろな背景" },
  { id: "atelier", label: "アトリエ机", note: "やわらかい紙と線" },
  { id: "blueprint", label: "青写真", note: "設計図っぽいグリッド" },
  { id: "sunset", label: "ポスター", note: "あたたかい紙ポスター" },
];

const SOUND_SOURCES = {
  select: "/se/se1.mp3",
  place: "/se/se2.mp3",
  adjust: "/se/se3.mp3",
  duplicate: "/se/se4.mp3",
  remove: "/se/se5.mp3",
  background: "/se/se6.mp3",
  export: "/se/se7.mp3",
};

const DEFAULT_BACKGROUND_ID = BACKGROUNDS[0].id;

const clampNum = (value, min, max) => Math.min(max, Math.max(min, value));
const asNumber = (value, fallback) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `stamp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const fileToLabel = (file) => file.replace(/\.[^.]+$/u, "");
const fileToImagePath = (file) => `/images/${encodeURIComponent(file)}`;

const STAMP_CATALOG = FILES.map((file, index) => ({
  id: `stamp-${index}`,
  file,
  name: fileToLabel(file),
  img: fileToImagePath(file),
}));

const sortByZ = (left, right) => asNumber(left.z, 0) - asNumber(right.z, 0);

const normalizePlacedStamp = (stamp, index) => {
  if (!stamp || typeof stamp !== "object") return null;

  return {
    id: String(stamp.id || createId()),
    stampId: String(stamp.stampId || `legacy-${index}`),
    name: String(stamp.name || "スタンプ"),
    img: String(stamp.img || ""),
    x: clampNum(asNumber(stamp.x, 50), 2, 98),
    y: clampNum(asNumber(stamp.y, 50), 4, 96),
    size: clampNum(asNumber(stamp.size, DEFAULT_SIZE), 72, 420),
    rotation: clampNum(asNumber(stamp.rotation, 0), -180, 180),
    opacity: clampNum(asNumber(stamp.opacity, 1), 0.25, 1),
    flipX: Boolean(stamp.flipX),
    z: asNumber(stamp.z, index + 1),
  };
};

const normalizeCustomBackground = (background) => {
  if (!background || typeof background !== "object") return null;
  if (!background.src || typeof background.src !== "string") return null;

  return {
    name: String(background.name || "アップロード背景"),
    src: background.src,
  };
};

const loadSavedState = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const storedStamps = Array.isArray(parsed?.placedStamps) ? parsed.placedStamps : [];
    const placedStamps = storedStamps
      .map((stamp, index) => normalizePlacedStamp(stamp, index))
      .filter(Boolean);
    const customBackground = normalizeCustomBackground(parsed?.customBackground);
    const requestedBackgroundId = String(parsed?.backgroundId || DEFAULT_BACKGROUND_ID);
    const isBuiltInBackground = BACKGROUNDS.some((background) => background.id === requestedBackgroundId);
    const backgroundId =
      requestedBackgroundId === CUSTOM_BACKGROUND_ID && customBackground?.src
        ? CUSTOM_BACKGROUND_ID
        : isBuiltInBackground
          ? requestedBackgroundId
          : DEFAULT_BACKGROUND_ID;
    const loadedBgmVolume = clampNum(asNumber(parsed?.bgmVolume, DEFAULT_BGM_VOLUME), 0, 1);
    const loadedIsBgmEnabled = parsed?.isBgmEnabled !== false && loadedBgmVolume > 0;
    const loadedLastBgmVolume = clampNum(
      asNumber(parsed?.lastBgmVolume, loadedBgmVolume || DEFAULT_BGM_VOLUME),
      0,
      1,
    );

    return {
      placedStamps,
      backgroundId,
      customBackground,
      bgmVolume: loadedIsBgmEnabled ? loadedBgmVolume : 0,
      seVolume: clampNum(asNumber(parsed?.seVolume, DEFAULT_SE_VOLUME), 0, 1),
      isBgmEnabled: loadedIsBgmEnabled,
      lastBgmVolume: loadedLastBgmVolume > 0 ? loadedLastBgmVolume : DEFAULT_BGM_VOLUME,
    };
  } catch (error) {
    console.warn("Failed to load stamp studio state", error);
    return null;
  }
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });

const loadFileImage = (file) =>
  new Promise((resolve, reject) => {
    const url = window.URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      window.URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      window.URL.revokeObjectURL(url);
      reject(new Error(`Failed to load uploaded image: ${file.name}`));
    };

    image.src = url;
  });

const drawCoverImage = (ctx, image, width, height) => {
  const naturalWidth = image.naturalWidth || image.width || width;
  const naturalHeight = image.naturalHeight || image.height || height;
  const scale = Math.max(width / naturalWidth, height / naturalHeight);
  const drawWidth = naturalWidth * scale;
  const drawHeight = naturalHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);
};

const prepareUploadedBackground = async (file) => {
  const image = await loadFileImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context is unavailable");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
  drawCoverImage(ctx, image, EXPORT_WIDTH, EXPORT_HEIGHT);

  return {
    name: file.name.replace(/\.[^.]+$/u, "") || "アップロード背景",
    src: canvas.toDataURL("image/jpeg", 0.88),
  };
};

const paintAtelierBackground = (ctx, width, height) => {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#fcf0cb");
  gradient.addColorStop(1, "#f0d08f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = "rgba(118, 78, 24, 0.08)";
  ctx.lineWidth = 1;
  for (let y = 36; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let x = 36; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let i = 0; i < 42; i += 1) {
    const radius = 18 + (i % 4) * 8;
    const x = (width / 41) * i;
    const y = (height / 7) * ((i * 3) % 7);
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

const paintBlueprintBackground = (ctx, width, height) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#1a416f");
  gradient.addColorStop(1, "#0d2541");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= width; x += 192) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 192) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
};

const paintSunsetBackground = (ctx, width, height) => {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#ffe0b7");
  gradient.addColorStop(0.55, "#ff9e86");
  gradient.addColorStop(1, "#ff6d6f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const leftGlow = ctx.createRadialGradient(
    width * 0.18,
    height * 0.2,
    24,
    width * 0.18,
    height * 0.2,
    width * 0.32,
  );
  leftGlow.addColorStop(0, "rgba(255,255,255,0.55)");
  leftGlow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = leftGlow;
  ctx.fillRect(0, 0, width, height);

  const rightGlow = ctx.createRadialGradient(
    width * 0.82,
    height * 0.74,
    30,
    width * 0.82,
    height * 0.74,
    width * 0.26,
  );
  rightGlow.addColorStop(0, "rgba(255,227,177,0.35)");
  rightGlow.addColorStop(1, "rgba(255,227,177,0)");
  ctx.fillStyle = rightGlow;
  ctx.fillRect(0, 0, width, height);
};

const paintPresetBackground = (ctx, width, height, backgroundId) => {
  if (backgroundId === "plain") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (backgroundId === "blueprint") {
    paintBlueprintBackground(ctx, width, height);
    return;
  }

  if (backgroundId === "sunset") {
    paintSunsetBackground(ctx, width, height);
    return;
  }

  paintAtelierBackground(ctx, width, height);
};

const renderBackgroundToContext = async (ctx, width, height, backgroundId, customBackground) => {
  if (backgroundId === CUSTOM_BACKGROUND_ID && customBackground?.src) {
    const image = await loadImage(customBackground.src);
    drawCoverImage(ctx, image, width, height);
    return;
  }

  paintPresetBackground(ctx, width, height, backgroundId);
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    update();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, [query]);

  return matches;
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
};

export default function App() {
  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const nextZRef = useRef(1);
  const fileInputRef = useRef(null);
  const bgmRef = useRef(null);
  const resumeBgmRef = useRef(() => {});
  const bgmEnabledRef = useRef(true);
  const bgmVolumeRef = useRef(DEFAULT_BGM_VOLUME);
  const lastBgmVolumeRef = useRef(DEFAULT_BGM_VOLUME);
  const isCompactLandscape = useMediaQuery(COMPACT_LANDSCAPE_QUERY);

  const [placedStamps, setPlacedStamps] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [armedStampId, setArmedStampId] = useState(null);
  const [search, setSearch] = useState("");
  const [backgroundId, setBackgroundId] = useState(DEFAULT_BACKGROUND_ID);
  const [customBackground, setCustomBackground] = useState(null);
  const [hasLoadedSave, setHasLoadedSave] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPreparingBackground, setIsPreparingBackground] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(DEFAULT_BGM_VOLUME);
  const [seVolume, setSeVolume] = useState(DEFAULT_SE_VOLUME);
  const [isBgmEnabled, setIsBgmEnabled] = useState(true);
  const [bgmState, setBgmState] = useState("starting");

  const resumeBgm = () => {
    resumeBgmRef.current?.();
  };

  const playSe = (key, options = {}) => {
    resumeBgm();
    if (seVolume <= 0) return;

    const src = SOUND_SOURCES[key];
    if (!src) return;

    const audio = new Audio(src);
    audio.volume = clampNum(seVolume * (options.volumeMultiplier ?? 1), 0, 1);
    audio.playbackRate = options.playbackRate ?? 1;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const saved = loadSavedState();
    if (saved) {
      setPlacedStamps(saved.placedStamps);
      setBackgroundId(saved.backgroundId);
      setCustomBackground(saved.customBackground);
      setBgmVolume(saved.bgmVolume);
      setSeVolume(saved.seVolume);
      setIsBgmEnabled(saved.isBgmEnabled);
      lastBgmVolumeRef.current = saved.lastBgmVolume > 0 ? saved.lastBgmVolume : DEFAULT_BGM_VOLUME;
      nextZRef.current = saved.placedStamps.reduce(
        (max, stamp) => Math.max(max, asNumber(stamp.z, 0)),
        0,
      ) + 1;
    }
    setHasLoadedSave(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSave || typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          backgroundId,
          customBackground,
          placedStamps,
          bgmVolume,
          seVolume,
          isBgmEnabled,
          lastBgmVolume: lastBgmVolumeRef.current,
        }),
      );
    } catch (error) {
      console.warn("Failed to save stamp studio state", error);
    }
  }, [backgroundId, bgmVolume, customBackground, hasLoadedSave, isBgmEnabled, placedStamps, seVolume]);

  useEffect(() => {
    bgmEnabledRef.current = isBgmEnabled;
  }, [isBgmEnabled]);

  useEffect(() => {
    bgmVolumeRef.current = bgmVolume;
    if (bgmVolume > 0) {
      lastBgmVolumeRef.current = bgmVolume;
    }
  }, [bgmVolume]);

  useEffect(() => {
    const audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = bgmVolume;
    bgmRef.current = audio;

    const syncPlaying = () => setBgmState("playing");
    const syncWaiting = () => setBgmState(bgmEnabledRef.current ? "waiting" : "off");
    const syncError = () => setBgmState("error");

    audio.addEventListener("play", syncPlaying);
    audio.addEventListener("playing", syncPlaying);
    audio.addEventListener("pause", syncWaiting);
    audio.addEventListener("error", syncError);

    const tryPlay = () => {
      if (!bgmEnabledRef.current || bgmVolumeRef.current <= 0) {
        audio.pause();
        setBgmState("off");
        return;
      }
      audio.volume = bgmVolumeRef.current;
      audio
        .play()
        .then(() => setBgmState("playing"))
        .catch(() => setBgmState("waiting"));
    };

    resumeBgmRef.current = tryPlay;
    tryPlay();

    const unlockAudio = () => {
      tryPlay();
    };

    window.addEventListener("pointerdown", unlockAudio, true);
    window.addEventListener("keydown", unlockAudio, true);
    window.addEventListener("touchstart", unlockAudio, true);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio, true);
      window.removeEventListener("keydown", unlockAudio, true);
      window.removeEventListener("touchstart", unlockAudio, true);
      audio.pause();
      audio.removeEventListener("play", syncPlaying);
      audio.removeEventListener("playing", syncPlaying);
      audio.removeEventListener("pause", syncWaiting);
      audio.removeEventListener("error", syncError);
      resumeBgmRef.current = () => {};
      bgmRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!bgmRef.current) return;
    bgmRef.current.volume = bgmVolume;
    if (bgmVolume <= 0) {
      bgmRef.current.pause();
      setBgmState("off");
    }
  }, [bgmVolume]);

  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;

    if (!isBgmEnabled) {
      audio.pause();
      setBgmState("off");
      return;
    }

    resumeBgm();
  }, [isBgmEnabled]);

  useEffect(() => {
    if (!selectedId) return;
    if (!placedStamps.some((stamp) => stamp.id === selectedId)) {
      setSelectedId(null);
    }
  }, [placedStamps, selectedId]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = dragRef.current;
      const board = boardRef.current;
      if (!drag || !board) return;

      const rect = board.getBoundingClientRect();
      const x = ((event.clientX - rect.left - drag.offsetX) / rect.width) * 100;
      const y = ((event.clientY - rect.top - drag.offsetY) / rect.height) * 100;

      setPlacedStamps((current) =>
        current.map((stamp) =>
          stamp.id === drag.id
            ? {
                ...stamp,
                x: clampNum(x, 2, 98),
                y: clampNum(y, 4, 96),
              }
            : stamp,
        ),
      );
    };

    const stopDragging = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, []);

  const filteredCatalog = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return STAMP_CATALOG;

    return STAMP_CATALOG.filter(
      (stamp) =>
        stamp.name.toLowerCase().includes(keyword) || stamp.file.toLowerCase().includes(keyword),
    );
  }, [search]);

  const orderedStamps = useMemo(() => [...placedStamps].sort(sortByZ), [placedStamps]);

  const selectedStamp = selectedId ? placedStamps.find((stamp) => stamp.id === selectedId) || null : null;
  const armedStamp = armedStampId ? STAMP_CATALOG.find((stamp) => stamp.id === armedStampId) || null : null;
  const currentBackground =
    BACKGROUNDS.find((background) => background.id === backgroundId) || BACKGROUNDS[0];
  const currentBackgroundLabel =
    backgroundId === CUSTOM_BACKGROUND_ID && customBackground?.name
      ? customBackground.name
      : currentBackground.label;
  const currentBackgroundNote =
    backgroundId === CUSTOM_BACKGROUND_ID && customBackground?.src
      ? "アップロードした画像を背景に使用中"
      : currentBackground.note;

  const bgmStatusLabel =
    !isBgmEnabled
      ? "停止中"
      : bgmState === "playing"
        ? "再生中"
        : bgmState === "error"
          ? "読み込み失敗"
          : bgmState === "waiting"
        ? "再生待機"
        : "準備中";
  const stampRenderScale = isCompactLandscape ? COMPACT_LANDSCAPE_STAMP_SCALE : 1;

  const boardClassName =
    backgroundId === CUSTOM_BACKGROUND_ID && customBackground?.src
      ? "board has-image-bg"
      : `board theme-${backgroundId}`;

  const boardStyle =
    backgroundId === CUSTOM_BACKGROUND_ID && customBackground?.src
      ? {
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)), url("${customBackground.src}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : undefined;

  const placeStampAt = (catalogItem, x, y) => {
    const nextId = createId();
    const nextStamp = {
      id: nextId,
      stampId: catalogItem.id,
      name: catalogItem.name,
      img: catalogItem.img,
      x: clampNum(x, 2, 98),
      y: clampNum(y, 4, 96),
      size: DEFAULT_SIZE,
      rotation: 0,
      opacity: 1,
      flipX: false,
      z: nextZRef.current++,
    };

    setPlacedStamps((current) => [...current, nextStamp]);
    setSelectedId(nextId);
    playSe("place", { volumeMultiplier: 0.9 });
  };

  const updateStamp = (id, patch) => {
    setPlacedStamps((current) =>
      current.map((stamp) => (stamp.id === id ? { ...stamp, ...patch } : stamp)),
    );
  };

  const removeStampById = (id, options = {}) => {
    setPlacedStamps((current) => current.filter((stamp) => stamp.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (!options.silent) {
      playSe("remove", { volumeMultiplier: 0.9 });
    }
  };

  const duplicateStampById = (id, options = {}) => {
    const source = placedStamps.find((stamp) => stamp.id === id);
    if (!source) return;

    const nextId = createId();
    const duplicated = {
      ...source,
      id: nextId,
      x: clampNum(source.x + 4, 2, 98),
      y: clampNum(source.y + 4, 4, 96),
      z: nextZRef.current++,
    };

    setPlacedStamps((current) => [...current, duplicated]);
    setSelectedId(nextId);
    if (!options.silent) {
      playSe("duplicate");
    }
  };

  const bringToFront = (id) => {
    updateStamp(id, { z: nextZRef.current++ });
  };

  const sendToBack = (id) => {
    const minZ = placedStamps.reduce((min, stamp) => Math.min(min, asNumber(stamp.z, 0)), 0);
    updateStamp(id, { z: minZ - 1 });
  };

  const applyBackgroundSelection = (id) => {
    if (id === CUSTOM_BACKGROUND_ID && !customBackground?.src) return;
    setBackgroundId(id);
    playSe("background", { volumeMultiplier: 0.75 });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const active = document.activeElement;
      const isTyping =
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        active?.tagName === "SELECT" ||
        active?.isContentEditable;

      if (isTyping) return;

      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        event.preventDefault();
        removeStampById(selectedId);
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d" && selectedId) {
        event.preventDefault();
        duplicateStampById(selectedId);
        return;
      }

      if (event.key === "Escape") {
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [placedStamps, selectedId]);

  const handleBoardClick = (event) => {
    if (event.target !== event.currentTarget) return;

    resumeBgm();
    if (!armedStamp) {
      setSelectedId(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    placeStampAt(armedStamp, x, y);
  };

  const handleStartDrag = (event, stamp) => {
    event.preventDefault();
    event.stopPropagation();
    resumeBgm();

    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const stampX = (stamp.x / 100) * rect.width;
    const stampY = (stamp.y / 100) * rect.height;

    dragRef.current = {
      id: stamp.id,
      offsetX: event.clientX - rect.left - stampX,
      offsetY: event.clientY - rect.top - stampY,
    };

    bringToFront(stamp.id);
    setSelectedId(stamp.id);
  };

  const handleClearCanvas = () => {
    resumeBgm();
    if (!placedStamps.length) return;
    if (!window.confirm("キャンバス上のスタンプをすべて消しますか？")) return;

    setPlacedStamps([]);
    setSelectedId(null);
    playSe("remove");
  };

  const handleCustomBackgroundUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("画像ファイルを選んでください。");
      return;
    }

    resumeBgm();
    setIsPreparingBackground(true);

    try {
      const prepared = await prepareUploadedBackground(file);
      setCustomBackground(prepared);
      setBackgroundId(CUSTOM_BACKGROUND_ID);
      playSe("background");
    } catch (error) {
      console.error(error);
      window.alert("背景画像の読み込みに失敗しました。別の画像で試してください。");
    } finally {
      setIsPreparingBackground(false);
    }
  };

  const handleRemoveCustomBackground = () => {
    resumeBgm();
    if (!customBackground?.src) return;
    if (!window.confirm("アップロードした背景画像を削除しますか？")) return;

    setCustomBackground(null);
    if (backgroundId === CUSTOM_BACKGROUND_ID) {
      setBackgroundId(DEFAULT_BACKGROUND_ID);
    }
    playSe("remove", { volumeMultiplier: 0.85 });
  };

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const boardWidth = boardRef.current?.clientWidth || EXPORT_WIDTH;
      const scale = EXPORT_WIDTH / boardWidth;
      const canvas = document.createElement("canvas");
      canvas.width = EXPORT_WIDTH;
      canvas.height = EXPORT_HEIGHT;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context is unavailable");

      await renderBackgroundToContext(ctx, EXPORT_WIDTH, EXPORT_HEIGHT, backgroundId, customBackground);

      const uniqueSources = [...new Set(placedStamps.map((stamp) => stamp.img))];
      const loadedImages = await Promise.all(
        uniqueSources.map(async (src) => [src, await loadImage(src)]),
      );
      const imageMap = new Map(loadedImages);

      [...placedStamps].sort(sortByZ).forEach((stamp) => {
        const image = imageMap.get(stamp.img);
        if (!image) return;

        const x = (stamp.x / 100) * EXPORT_WIDTH;
        const y = (stamp.y / 100) * EXPORT_HEIGHT;
        const drawWidth = stamp.size * scale * stampRenderScale;
        const naturalWidth = image.naturalWidth || image.width || 1;
        const naturalHeight = image.naturalHeight || image.height || 1;
        const drawHeight = drawWidth * (naturalHeight / naturalWidth);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((stamp.rotation * Math.PI) / 180);
        ctx.scale(stamp.flipX ? -1 : 1, 1);
        ctx.globalAlpha = stamp.opacity;
        if (backgroundId !== "plain") {
          ctx.shadowColor = "rgba(12, 22, 34, 0.24)";
          ctx.shadowBlur = 28;
          ctx.shadowOffsetY = 12;
        }
        ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
      });

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((nextBlob) => {
          if (nextBlob) {
            resolve(nextBlob);
            return;
          }
          reject(new Error("Failed to create PNG blob"));
        }, "image/png");
      });

      const timestamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);
      downloadBlob(blob, `robot-kojyo-stamp-${timestamp}.png`);
      playSe("export");
    } catch (error) {
      console.error(error);
      window.alert("PNG保存に失敗しました。時間を空けてもう一度試してください。");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSliderCommit = () => {
    playSe("adjust", { volumeMultiplier: 0.45, playbackRate: 1.03 });
  };

  const handleBgmVolumeChange = (value) => {
    const nextVolume = clampNum(value, 0, 1);
    setBgmVolume(nextVolume);

    if (nextVolume <= 0) {
      setIsBgmEnabled(false);
      return;
    }

    setIsBgmEnabled(true);
  };

  const handleToggleBgm = () => {
    if (isBgmEnabled && bgmVolume > 0) {
      lastBgmVolumeRef.current = bgmVolume;
      setIsBgmEnabled(false);
      setBgmVolume(0);
      return;
    }

    const restoredVolume = lastBgmVolumeRef.current > 0 ? lastBgmVolumeRef.current : DEFAULT_BGM_VOLUME;
    setBgmVolume(restoredVolume);
    setIsBgmEnabled(true);
  };

  return (
    <div className="wrap">
      <header className="panel hero">
        <div>
          <p className="eyebrow">Robot Kojyo</p>
          <h1>ロボットコージョー</h1>
        </div>
      </header>

      <main className="workspace">
        <aside className="panel shelf">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Stamp Shelf</p>
              <h2>スタンプ棚</h2>
            </div>
            <p className="panel-note">
              {filteredCatalog.length} / {STAMP_CATALOG.length}
            </p>
          </div>

          <label className="search-label" htmlFor="stamp-search">
            <span>検索</span>
            <input
              id="stamp-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="名前でしぼりこむ"
            />
          </label>

          <div className="shelf-help">
            スタンプを1つ選ぶと、中央のキャンバスをクリックした場所へ何度でも押せます。
          </div>

          <div className="shelf-grid">
            {filteredCatalog.map((stamp) => (
              <button
                key={stamp.id}
                type="button"
                className={`shelf-item ${armedStampId === stamp.id ? "active" : ""}`}
                onClick={() => {
                  setArmedStampId((current) => (current === stamp.id ? null : stamp.id));
                  setSelectedId(null);
                  playSe("select", { volumeMultiplier: 0.6 });
                }}
                aria-pressed={armedStampId === stamp.id}
              >
                <span className="shelf-thumb">
                  <img src={stamp.img} alt={stamp.name} loading="lazy" />
                </span>
                <span className="shelf-name">{stamp.name}</span>
              </button>
            ))}

            {!filteredCatalog.length ? <div className="empty-card">一致するスタンプがありません。</div> : null}
          </div>
        </aside>

        <section className="panel board-panel">
          <div className="panel-head board-head">
            <div>
              <p className="panel-kicker">Canvas</p>
              <h2>スタンプキャンバス</h2>
            </div>
          </div>

          <div className="board-shell">
            <div ref={boardRef} className={boardClassName} style={boardStyle} onClick={handleBoardClick}>
              {orderedStamps.map((stamp) => (
                <button
                  key={stamp.id}
                  type="button"
                  className={`placed-stamp ${selectedId === stamp.id ? "selected" : ""}`}
                  style={{
                    "--stamp-size": `${stamp.size}px`,
                    "--stamp-scale": stampRenderScale,
                    left: `${stamp.x}%`,
                    top: `${stamp.y}%`,
                    opacity: stamp.opacity,
                    transform: `translate(-50%, -50%) rotate(${stamp.rotation}deg) scaleX(${stamp.flipX ? -1 : 1})`,
                    zIndex: stamp.z,
                  }}
                  onPointerDown={(event) => handleStartDrag(event, stamp)}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedId(stamp.id);
                    playSe("select", { volumeMultiplier: 0.45, playbackRate: 1.05 });
                  }}
                >
                  <img src={stamp.img} alt={stamp.name} draggable={false} />
                </button>
              ))}

              {!orderedStamps.length ? (
                <div className="board-empty">
                  <div className="board-empty-card">
                    <strong>{armedStamp ? `${armedStamp.name} を押してみよう` : "まずはスタンプを選ぼう"}</strong>
                    <p>
                      {armedStamp
                        ? "このキャンバスをクリックすると、選んだ画像がその位置に置かれます。"
                        : "背景画像をアップしてから、スタンプ棚でスタンプを選ぶこともできます。"}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="board-controls">
            <div className="board-toolbar">
              <div className="bg-picker">
                {BACKGROUNDS.map((background) => (
                  <button
                    key={background.id}
                    type="button"
                    className={`chip-btn ${backgroundId === background.id ? "active" : ""}`}
                    onClick={() => applyBackgroundSelection(background.id)}
                    aria-pressed={backgroundId === background.id}
                  >
                    {background.label}
                  </button>
                ))}
                {customBackground?.src ? (
                  <button
                    type="button"
                    className={`chip-btn ${backgroundId === CUSTOM_BACKGROUND_ID ? "active" : ""}`}
                    onClick={() => applyBackgroundSelection(CUSTOM_BACKGROUND_ID)}
                    aria-pressed={backgroundId === CUSTOM_BACKGROUND_ID}
                  >
                    画像背景
                  </button>
                ) : null}
              </div>

              <div className="toolbar-actions">
                <button type="button" className="ghost-btn" onClick={handleExport} disabled={isExporting}>
                  {isExporting ? "書き出し中..." : "PNG保存"}
                </button>
                <button
                  type="button"
                  className="ghost-btn danger"
                  onClick={handleClearCanvas}
                  disabled={!placedStamps.length}
                >
                  キャンバス全消去
                </button>
              </div>
            </div>

            <div className="media-rack">
              <section className="media-card">
                <div className="media-head">
                  <div>
                    <h3>背景画像</h3>
                    <p className="media-copy">{currentBackgroundNote}</p>
                  </div>
                  <span className="media-tag">現在: {currentBackgroundLabel}</span>
                </div>

                <div className="upload-row">
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      resumeBgm();
                      fileInputRef.current?.click();
                    }}
                    disabled={isPreparingBackground}
                  >
                    {isPreparingBackground ? "背景を準備中..." : "画像をアップロード"}
                  </button>
                  {customBackground?.src ? (
                    <button
                      type="button"
                      className="inline-btn"
                      onClick={() => applyBackgroundSelection(CUSTOM_BACKGROUND_ID)}
                    >
                      この画像を使う
                    </button>
                  ) : null}
                  {customBackground?.src ? (
                    <button
                      type="button"
                      className="inline-btn danger-outline"
                      onClick={handleRemoveCustomBackground}
                    >
                      画像背景を削除
                    </button>
                  ) : null}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleCustomBackgroundUpload}
                />

                {customBackground?.src ? (
                  <div className="media-preview">
                    <img src={customBackground.src} alt={customBackground.name} />
                  </div>
                ) : (
                  <div className="media-placeholder">
                    端末の画像を読み込むと、ここから背景に切り替えられます。
                  </div>
                )}
              </section>

              <section className="media-card">
                <div className="media-head">
                  <div>
                    <h3>サウンド</h3>
                    <p className="media-copy">`bgm3` をループ再生し、操作ごとに効果音を鳴らします。</p>
                  </div>
                  <span className={`media-tag sound-${isBgmEnabled ? bgmState : "off"}`}>BGM {bgmStatusLabel}</span>
                </div>

                <div className="upload-row">
                  <button type="button" className="ghost-btn" onClick={handleToggleBgm}>
                    {isBgmEnabled ? "BGMをオフ" : "BGMをオン"}
                  </button>
                </div>

                <label className="range-control compact">
                  <div className="range-label">
                    <span>BGM音量</span>
                    <strong>{Math.round(bgmVolume * 100)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={bgmVolume}
                    onChange={(event) => handleBgmVolumeChange(Number(event.target.value))}
                    onPointerUp={() => playSe("adjust", { volumeMultiplier: 0.35 })}
                    onKeyUp={() => playSe("adjust", { volumeMultiplier: 0.35 })}
                  />
                </label>

                <label className="range-control compact">
                  <div className="range-label">
                    <span>効果音音量</span>
                    <strong>{Math.round(seVolume * 100)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={seVolume}
                    onChange={(event) => setSeVolume(Number(event.target.value))}
                    onPointerUp={() => playSe("adjust", { volumeMultiplier: 0.45 })}
                    onKeyUp={() => playSe("adjust", { volumeMultiplier: 0.45 })}
                  />
                </label>

                <p className="audio-note">
                  ブラウザの仕様で、BGM は最初の操作後に再生開始になる場合があります。
                </p>
              </section>
            </div>
          </div>

          <p className="small">
            配置はブラウザに自動保存されます。`Delete` / `Backspace` で削除、`Ctrl + D`
            で複製できます。
          </p>
        </section>

        <aside className="panel inspector">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Adjust</p>
              <h2>調整パネル</h2>
            </div>
          </div>

          {selectedStamp ? (
            <>
              <div className="preview-card">
                <div className="preview-art">
                  <img
                    src={selectedStamp.img}
                    alt={selectedStamp.name}
                    style={{
                      transform: `rotate(${selectedStamp.rotation}deg) scaleX(${selectedStamp.flipX ? -1 : 1})`,
                      opacity: selectedStamp.opacity,
                    }}
                  />
                </div>
                <div className="preview-name">{selectedStamp.name}</div>
                <div className="preview-meta">ドラッグで移動しながら、ここで見た目を仕上げられます。</div>
              </div>

              <label className="range-control">
                <div className="range-label">
                  <span>サイズ</span>
                  <strong>{Math.round(selectedStamp.size)}px</strong>
                </div>
                <input
                  type="range"
                  min="72"
                  max="420"
                  step="1"
                  value={selectedStamp.size}
                  onChange={(event) => updateStamp(selectedStamp.id, { size: Number(event.target.value) })}
                  onPointerUp={handleSliderCommit}
                  onKeyUp={handleSliderCommit}
                />
              </label>

              <label className="range-control">
                <div className="range-label">
                  <span>回転</span>
                  <strong>{Math.round(selectedStamp.rotation)}°</strong>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={selectedStamp.rotation}
                  onChange={(event) =>
                    updateStamp(selectedStamp.id, { rotation: Number(event.target.value) })
                  }
                  onPointerUp={handleSliderCommit}
                  onKeyUp={handleSliderCommit}
                />
              </label>

              <label className="range-control">
                <div className="range-label">
                  <span>透明度</span>
                  <strong>{Math.round(selectedStamp.opacity * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="1"
                  step="0.01"
                  value={selectedStamp.opacity}
                  onChange={(event) =>
                    updateStamp(selectedStamp.id, { opacity: Number(event.target.value) })
                  }
                  onPointerUp={handleSliderCommit}
                  onKeyUp={handleSliderCommit}
                />
              </label>

              <div className="action-grid">
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => {
                    updateStamp(selectedStamp.id, { flipX: !selectedStamp.flipX });
                    playSe("adjust", { volumeMultiplier: 0.65 });
                  }}
                >
                  左右反転
                </button>
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => duplicateStampById(selectedStamp.id)}
                >
                  複製
                </button>
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => {
                    bringToFront(selectedStamp.id);
                    playSe("adjust", { volumeMultiplier: 0.55, playbackRate: 1.08 });
                  }}
                >
                  前面へ
                </button>
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => {
                    sendToBack(selectedStamp.id);
                    playSe("adjust", { volumeMultiplier: 0.55, playbackRate: 0.94 });
                  }}
                >
                  背面へ
                </button>
                <button
                  type="button"
                  className="action-btn danger"
                  onClick={() => removeStampById(selectedStamp.id)}
                >
                  削除
                </button>
                <button type="button" className="inline-btn" onClick={() => setSelectedId(null)}>
                  選択解除
                </button>
              </div>
            </>
          ) : armedStamp ? (
            <div className="empty-inspector">
              <strong>{armedStamp.name} を選択中です。</strong>
              キャンバスをクリックすると、この画像をスタンプとして押せます。別の画像を押したいときは左の棚から選び直してください。
              <div className="armed-preview">
                <img src={armedStamp.img} alt={armedStamp.name} />
              </div>
              <button
                type="button"
                className="inline-btn"
                onClick={() => {
                  setArmedStampId(null);
                  playSe("select", { volumeMultiplier: 0.45, playbackRate: 0.96 });
                }}
              >
                スタンプ選択を解除
              </button>
            </div>
          ) : (
            <div className="empty-inspector">
              <strong>ここで仕上げます。</strong>
              配置したスタンプをクリックすると、サイズ変更、回転、透明度、重なり順、複製、削除ができます。
            </div>
          )}
        </aside>
      </main>

    </div>
  );
}
