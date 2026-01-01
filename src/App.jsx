import { useEffect, useMemo, useRef, useState } from "react";

import "./styles.css";
const STAT_LABELS = { red: "攻撃力", orange: "滅ぼし力", green: "体力", cyan: "行動力" };


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



const ITEMS = FILES.map((file, idx) => {
  const base = file.replace(/\.png$/i, "");
  const m = base.match(/^(\d{1,3})/);
  const order = m ? Number(m[1]) : 1000 + idx;
  const key = base;
  const name = base;
  const stats = { red: 10, orange: 10, green: 100, cyan: 10 };
  return { key, name, img: `/images/${file}`, order, idx, stats };
}).sort((a, b) => (a.order === b.order ? a.idx - b.idx : a.order - b.order));


const LS_DRAWN = "gacha_drawn_map_v1";
const LS_COUNT = "gacha_count_v3";
const LS_COUNTS = "gacha_card_counts_v1";
const LS_CANVAS = "gacha_canvas_v1";

const randItem = () => ITEMS[Math.floor(Math.random() * ITEMS.length)];

const Badge = ({ got }) => (
  <span className={`badge ${got ? "got" : "locked"}`}>{got ? "入手済" : "未入手"}</span>
);

function App() {
  const [drawnMap, setDrawnMap] = useState({});
  const [countsMap, setCountsMap] = useState({});
  const [drawCount, setDrawCount] = useState(0);
  const [result, setResult] = useState({ type: "message" });
  const [activeTab, setActiveTab] = useState("catalog");
  const [modalImg, setModalImg] = useState(null);
  const [mode, setMode] = useState("normal");
  const [bgmOn, setBgmOn] = useState(true);
  const [bgmVol, setBgmVol] = useState(0.4);
  const [lastDrawnName, setLastDrawnName] = useState(null);
  const [shakeName, setShakeName] = useState(null);
  const [drawPulse, setDrawPulse] = useState(0);
  const [ownedHover, setOwnedHover] = useState(null);
  const [enemyPlaced, setEnemyPlaced] = useState(false);
  const [canvasItems, setCanvasItems] = useState([]);
  const [hoverStat, setHoverStat] = useState("");
  const [previewPos, setPreviewPos] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasAspect, setCanvasAspect] = useState(16 / 9);

  const dexBodyRef = useRef(null);
  const historyRef = useRef(null);
  const ownedRef = useRef(null);
  const catalogRef = useRef(null);
  const canvasRef = useRef(null);
  const dragItemRef = useRef(null);
  const dragOffsetRef = useRef(null);
  const resizeStartRef = useRef(null);
  const resizingRef = useRef(false);

  const audioRefs = {
    bgm: useRef(null),
    se1: useRef(null),
    se2: useRef(null),
    se3: useRef(null),
    se4: useRef(null),
    se5: useRef(null),
    se6: useRef(null),
    se7: useRef(null),
  };

  const playSound = (id, volume = 0.7) => {
    const el = audioRefs[id]?.current;
    if (!el) return;
    const clone = el.cloneNode(true);
    clone.volume = volume;
    clone.currentTime = 0;
    clone.play().catch(() => {});
  };

  useEffect(() => {
    const bgm = audioRefs.bgm.current;
    if (!bgm) return;
    const handleTimeUpdate = () => {
      if (bgm.duration && bgm.currentTime > bgm.duration - 0.12) {
        bgm.currentTime = 0;
        bgm.play().catch(() => {});
      }
    };
    const handleEnded = () => {
      bgm.currentTime = 0;
      bgm.play().catch(() => {});
    };
    bgm.loop = true;
    bgm.addEventListener("timeupdate", handleTimeUpdate);
    bgm.addEventListener("ended", handleEnded);
    return () => {
      bgm.removeEventListener("timeupdate", handleTimeUpdate);
      bgm.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const bgm = audioRefs.bgm.current;
    if (!bgm) return;
    bgm.volume = bgmVol;
    if (bgmOn) {
      const play = bgm.play();
      if (play && typeof play.catch === "function") play.catch(() => {});
    } else {
      bgm.pause();
    }
  }, [bgmOn, bgmVol]);

  useEffect(() => {
    const handler = () => {
      if (!bgmOn) return;
      const bgm = audioRefs.bgm.current;
      if (!bgm) return;
      bgm.play().catch(() => {});
    };
    document.addEventListener("click", handler, { once: true });
    return () => document.removeEventListener("click", handler);
  }, [bgmOn]);

  useEffect(() => {
    localStorage.removeItem(LS_DRAWN);
    localStorage.removeItem(LS_COUNT);
    localStorage.removeItem(LS_COUNTS);
    setDrawnMap({});
    setCountsMap({});
    setDrawCount(0);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(LS_CANVAS);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setCanvasItems(parsed);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_DRAWN, JSON.stringify(drawnMap));
    localStorage.setItem(LS_COUNTS, JSON.stringify(countsMap));
    localStorage.setItem(LS_COUNT, String(drawCount));
  }, [drawnMap, countsMap, drawCount]);

  useEffect(() => {
    localStorage.setItem(LS_CANVAS, JSON.stringify(canvasItems));
  }, [canvasItems]);

  useEffect(() => {
    if (mode !== "canvas") return;
    const onKey = (e) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        if (!selectedId) return;
        e.preventDefault();
        setCanvasItems((prev) => prev.filter((c) => c.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, selectedId]);

  useEffect(() => {
    if (!lastDrawnName) return;
    const raf = requestAnimationFrame(() => scrollToHistory(lastDrawnName));
    return () => cancelAnimationFrame(raf);
  }, [lastDrawnName, drawnMap]);

  useEffect(() => {
    if (!shakeName) return;
    const timer = setTimeout(() => setShakeName(null), 350);
    return () => clearTimeout(timer);
  }, [shakeName]);
  // キャンバスの縦横比を保持（バトル表示の中央正方形クロップ用）
  useEffect(() => {
    const updateAspect = () => {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width && rect.height) setCanvasAspect(rect.width / rect.height);
    };
    updateAspect();
    window.addEventListener("resize", updateAspect);
    return () => window.removeEventListener("resize", updateAspect);
  }, [mode, canvasItems.length]);

  const scrollToHistory = (name) => {
    const body = catalogRef.current || dexBodyRef.current;
    const list = historyRef.current;
    if (!body || !list) return;
    const card = list.querySelector(`[data-name="${name}"]`);
    if (!card) return;
    const top = card.offsetTop - 8;
    body.scrollTo({ top, behavior: "smooth" });
  };

  const handleDraw = () => {
    setMode("normal");
    setEnemyPlaced(false);
    setPreviewPos(null);
    setPreviewItem(null);
    setSelectedId(null);
    setIsDragging(false);
    setResult((prev) => (prev?.type === "item" ? prev : { type: "message" }));
  };

  const handleGacha = () => {
    setMode("normal");
    setPreviewPos(null);
    setPreviewItem(null);
    setSelectedId(null);
    setIsDragging(false);
    playSound("se6", 0.8);
    const item = randItem();
    const now = Date.now();
    setDrawnMap((prev) => ({ ...prev, [item.key]: prev[item.key] || now }));
    setCountsMap((prev) => ({ ...prev, [item.key]: (prev[item.key] || 0) + 1 }));
    setDrawCount((c) => c + 1);
    setResult({ type: "item", item, at: now, count: drawCount + 1 });
    setLastDrawnName(item.key);
    setDrawPulse((p) => p + 1);
  };

  const handleUnlockAll = () => {
    const now = Date.now();
    const allDrawn = {};
    const allCounts = {};
    ITEMS.forEach((item) => {
      allDrawn[item.key] = now;
      allCounts[item.key] = 1;
    });
    setMode("normal");
    setPreviewPos(null);
    setPreviewItem(null);
    setSelectedId(null);
    setIsDragging(false);
    setResult({ type: "message" });
    setDrawnMap(allDrawn);
    setCountsMap(allCounts);
    setDrawCount(ITEMS.length);
    setLastDrawnName(null);
  };

  const handleAssemble = () => {
    playSound("se6", 0.6);
    setMode("canvas");
    setEnemyPlaced(false);
    setPreviewPos(null);
    setPreviewItem(null);
    setSelectedId(null);
    setIsDragging(false);
    dragOffsetRef.current = null;
    resizingRef.current = false;
    resizeStartRef.current = null;
    setResult({ type: "canvas" });
  };

  const handleBattle = () => {
    playSound("se6", 0.7);
    setMode("battle");
    setEnemyPlaced(false);
    setPreviewPos(null);
    setPreviewItem(null);
    setSelectedId(null);
    setIsDragging(false);
    resizingRef.current = false;
    resizeStartRef.current = null;
    setResult({ type: "battle" });
  };

  const ownedItems = useMemo(() => ITEMS.filter((i) => countsMap[i.key]), [countsMap]);
  const hoveredIdx = ownedItems.findIndex((i) => i.key === ownedHover);

  const CANVAS_MARGIN_X = 12;  // 横方向の余白％（飛び出し防止を強め）
  const CANVAS_MARGIN_Y = 29;  // 縦方向の余白％（飛び出し防止を強め）
  const clampX = (v) => Math.min(100 - CANVAS_MARGIN_X, Math.max(CANVAS_MARGIN_X, v));
  const clampY = (v) => Math.min(100 - CANVAS_MARGIN_Y, Math.max(CANVAS_MARGIN_Y, v));

  const addToCanvas = (item, xPerc, yPerc) => {
    if (mode !== "canvas") return;
    const spanX = 100 - CANVAS_MARGIN_X * 2;
    const spanY = 100 - CANVAS_MARGIN_Y * 2;
    const x = xPerc == null ? Math.random() * spanX + CANVAS_MARGIN_X : clampX(xPerc);
    const y = yPerc == null ? Math.random() * spanY + CANVAS_MARGIN_Y : clampY(yPerc);
    setCanvasItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        name: item.name,
        img: item.img,
        x,
        y,
        scale: 1,
      },
    ]);
  };

  const handleDragStart = (item, e) => {
    if (mode !== "canvas") return;
    dragItemRef.current = item;
    setPreviewItem(item);
    if (e && e.dataTransfer) {
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.dropEffect = "copy";
      try {
        e.dataTransfer.setData("text/plain", item.name);
      } catch (_) {}
    }
  };

  const handleDragEnd = () => {
    dragItemRef.current = null;
    setPreviewPos(null);
    setPreviewItem(null);
  };

  const handleCanvasDragOver = (e) => {
    if (mode !== "canvas") return;
    e.preventDefault();
    const item = dragItemRef.current;
    if (!item) return;
    const board = canvasRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const halfX = (260 / rect.width) * 50;
    const halfY = (260 / rect.height) * 50;
    const marginX = Math.max(CANVAS_MARGIN_X, halfX);
    const marginY = Math.max(CANVAS_MARGIN_Y, halfY);
    const cx = Math.min(100 - marginX, Math.max(marginX, x));
    const cy = Math.min(100 - marginY, Math.max(marginY, y));
    setPreviewPos({ x: cx, y: cy });
    setPreviewItem(item);
};

  const handleCanvasDragLeave = () => {
    if (mode !== "canvas") return;
    setPreviewPos(null);
    setPreviewItem(null);
  };

  const handleCanvasDrop = (e) => {
    if (mode !== "canvas") return;
    const item = dragItemRef.current;
    if (!item) return;
    const board = canvasRef.current;
    if (!board) return;
    e.preventDefault();
    const rect = board.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const halfX = (260 / rect.width) * 50;
    const halfY = (260 / rect.height) * 50;
    const marginX = Math.max(CANVAS_MARGIN_X, halfX);
    const marginY = Math.max(CANVAS_MARGIN_Y, halfY);
    const cx = Math.min(100 - marginX, Math.max(marginX, x));
    const cy = Math.min(100 - marginY, Math.max(marginY, y));
    addToCanvas(item, cx, cy);
    setPreviewPos(null);
    setPreviewItem(null);
    dragItemRef.current = null;
};

  const handleCanvasItemMouseDown = (item, e) => {
    if (mode !== "canvas") return;
    e.preventDefault();
    e.stopPropagation();
    const board = canvasRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const pointerX = ((e.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((e.clientY - rect.top) / rect.height) * 100;
    const itemRect = e.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      offsetX: pointerX - item.x,
      offsetY: pointerY - item.y,
      halfW: (itemRect.width / rect.width) * 50,
      halfH: (itemRect.height / rect.height) * 50,
    };
    window.addEventListener("mousemove", handleCanvasMouseMove);
    window.addEventListener("mouseup", handleCanvasMouseUp);
    setSelectedId(item.id);
    setIsDragging(true);
  };

  const startResize = (item, e) => {
    if (mode !== "canvas") return;
    e.preventDefault();
    e.stopPropagation();
    const board = canvasRef.current;
    if (!board) return;
    setSelectedId(item.id);
    resizingRef.current = true;
    const rect = board.getBoundingClientRect();
    resizeStartRef.current = {
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      startScale: item.scale || 1,
      boardWidth: rect.width,
      boardHeight: rect.height,
    };
  };

  const handleCanvasMouseMove = (e) => {
    if (mode !== "canvas" || (!isDragging && !resizingRef.current) || !selectedId) return;
    const board = canvasRef.current;
    if (!board) return;

    if (resizingRef.current && resizeStartRef.current?.id === selectedId) {
      const { startX, startY, startScale, boardWidth, boardHeight } = resizeStartRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const base = Math.max(boardWidth || 1, boardHeight || 1);
      const delta = Math.max(Math.abs(dx), Math.abs(dy)) * Math.sign(Math.max(dx, dy)) / base;
      const nextScale = Math.min(3, Math.max(0.2, startScale + delta));
      setCanvasItems((prev) => prev.map((c) => (c.id === selectedId ? { ...c, scale: nextScale } : c)));
      return;
    }

    const offset = dragOffsetRef.current;
    const rect = board.getBoundingClientRect();
    if (!offset || !rect) return;
    const pointerX = ((e.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((e.clientY - rect.top) / rect.height) * 100;
    const marginX = Math.max(CANVAS_MARGIN_X, offset.halfW ?? CANVAS_MARGIN_X);
    const marginY = Math.max(CANVAS_MARGIN_Y, offset.halfH ?? CANVAS_MARGIN_Y);
    const nx = Math.min(100 - marginX, Math.max(marginX, pointerX - offset.offsetX));
    const ny = Math.min(100 - marginY, Math.max(marginY, pointerY - offset.offsetY));
    setCanvasItems((prev) => prev.map((c) => (c.id === selectedId ? { ...c, x: nx, y: ny } : c)));
  };

  const handleCanvasMouseUp = () => {
    if (mode !== "canvas") return;
    setIsDragging(false);
    dragOffsetRef.current = null;
    resizingRef.current = false;
    resizeStartRef.current = null;
    window.removeEventListener("mousemove", handleCanvasMouseMove);
    window.removeEventListener("mouseup", handleCanvasMouseUp);
  };

  const handleCanvasBackgroundClick = (e) => {
    if (mode !== "canvas") return;
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  const historyList = ITEMS.map((item) => {
    const got = Boolean(drawnMap[item.key]);
    const displayName = got ? item.name : "???";
    return (
      <div
        key={item.key}
        className={`card ${got ? "got" : "locked"} history-card ${shakeName === item.key ? "shake" : ""}`}
        data-name={got ? item.key : undefined}
        onMouseEnter={() => playSound(got ? "se1" : "se2", 0.45)}
        onClick={() => {
          if (got) {
            playSound("se4", 0.65);
            setModalImg(item.img);
          } else {
            playSound("se5", 0.75);
            setShakeName(null);
            setTimeout(() => setShakeName(item.key), 0);
          }
        }}
      >
        <div className="history-row">
          <div className="thumb small">
            {got ? <img src={item.img} alt={item.name} loading="lazy" /> : null}
          </div>
          <div>
            <div className="item" style={{ margin: "0 0 4px" }}>{displayName}</div>
            <div className="small">
              <Badge got={got} />
            </div>
          </div>
          <div className="count-badge">所持数: {countsMap[item.key] || 0}</div>
        </div>
      </div>
    );
  });

  function handleOwnedMouseMove(e) {
    const card = e.target.closest?.(".stack-card");
    if (card && ownedRef.current && ownedRef.current.contains(card)) {
      const name = card.getAttribute("data-name");
      setOwnedHover(name || null);
      return;
    }
    setOwnedHover(null);
  }

  function handleOwnedCardLeave(e) {
    const next = e.relatedTarget;
    if (next && (next.closest?.(".stack-card") || (ownedRef.current && ownedRef.current.contains(next)))) {
      return;
    }
    setOwnedHover(null);
  }

  const ownedStack = ownedItems.map((item, idx) => {
    const jitterX = ((idx * 17) % 10) - 5;
    const jitterY = ((idx * 13) % 12) - 6;
    const baseLeft = 30 + idx * 64 + jitterX;
    const top = 120 + jitterY;
    const diff = hoveredIdx >= 0 ? idx - hoveredIdx : 0;
    const offset = hoveredIdx >= 0 ? diff * 40 : 0;
    const lift = diff === 0 && hoveredIdx >= 0 ? 40 : 0;
    const baseRot = ((idx * 9) % 8) - 4;
    const rot = hoveredIdx >= 0 ? (diff === 0 ? 0 : baseRot) : baseRot;
    const scale = hoveredIdx >= 0 ? (diff === 0 ? 1.02 : 0.94) : 1;
    const z = hoveredIdx >= 0 ? (diff === 0 ? 999 : 900 - Math.abs(diff)) : idx;
    return (
      <div
        key={item.key}
        className="stack-card"
        style={{ left: baseLeft + offset, top: top - lift, zIndex: z, transform: `rotate(${rot}deg) scale(${scale})`, cursor: mode === "canvas" ? "grab" : "default" }}
        data-name={item.key}
        draggable={mode === "canvas"}
        onMouseEnter={() => { setSelectedId(null); setOwnedHover(item.key); }}
        onMouseLeave={handleOwnedCardLeave}
        onDragStart={(e) => handleDragStart(item, e)}
        onDragEnd={handleDragEnd}
      >
        <img src={item.img} alt={item.name} draggable={false} />
        <div className="count-badge" style={{ right: 8, bottom: 8 }}>
          x{countsMap[item.key]}
        </div>
      </div>
    );
  });

  const hoveredName = ownedHover ? (ITEMS.find((i) => i.key === ownedHover)?.name || "") : "";
  const ownedTitle = selectedId ? (canvasItems.find((c) => c.id === selectedId)?.name || "") : hoveredName;
  const lookupStats = (keyOrName) => ITEMS.find((i) => i.key === keyOrName || i.name === keyOrName)?.stats;
  const ownedStats = selectedId ? lookupStats(canvasItems.find((c) => c.id === selectedId)?.name) : lookupStats(ownedHover);

  const canvasTotals = useMemo(() => {
    return canvasItems.reduce((acc, c) => {
      const st = lookupStats(c.name);
      if (st) {
        acc.red += st.red || 0;
        acc.orange += st.orange || 0;
        acc.green += st.green || 0;
        acc.cyan += st.cyan || 0;
      }
      return acc;
    }, { red: 0, orange: 0, green: 0, cyan: 0 });
  }, [canvasItems]);

    const squareGuide = (r) => {
    if (!r) return { top: "0%", bottom: "0%", left: "0%", right: "0%" };
    if (r > 1) {
      const m = (1 - 1 / r) * 50;
      return { top: "0%", bottom: "0%", left: `${m}%`, right: `${m}%` };
    }
    if (r < 1) {
      const m = ((1 / r) - 1) * 50;
      return { top: `${m}%`, bottom: `${m}%`, left: "0%", right: "0%" };
    }
    return { top: "0%", bottom: "0%", left: "0%", right: "0%" };
  };

  const resultNode = (() => {
    if (mode === "battle") {
      const r = canvasAspect || 1;
      let clipStyle = {};
      let guideStyle = { position: "absolute", inset: "0%" };
      if (r > 1) {
        const m = (1 - 1 / r) * 50;
        clipStyle = { clipPath: `inset(0% ${m}% 0% ${m}%)` };
        guideStyle = { position: "absolute", top: "0%", bottom: "0%", left: `${m}%`, right: `${m}%` };
      } else if (r < 1) {
        const m = ((1 / r) - 1) * 50;
        clipStyle = { clipPath: `inset(${m}% 0% ${m}% 0%)` };
        guideStyle = { position: "absolute", top: `${m}%`, bottom: `${m}%`, left: "0%", right: "0%" };
      }
            const gaugeList = [
        { key: "red", label: STAT_LABELS.red, value: canvasTotals.red, cls: "red" },
        { key: "orange", label: STAT_LABELS.orange, value: canvasTotals.orange, cls: "orange" },
        { key: "green", label: STAT_LABELS.green, value: canvasTotals.green, cls: "green" },
        { key: "cyan", label: STAT_LABELS.cyan, value: canvasTotals.cyan, cls: "cyan" },
      ];
      const maxGauge = Math.max(1, ...gaugeList.map((g) => g.value || 0));
      const humanGaugeMax = 100;
      const humanGaugeVal = Math.min(humanGaugeMax, Math.max(0, canvasTotals.orange));
      return (
        <div className="battle-wrap">
          <div className="battle-gauges">
            <div className="gauge-row-set">
              {gaugeList.map((g) => (
                <div className="gauge-row" key={g.key}>
                  <div className="gauge-label">{g.label}</div>
                  <div className="gauge-bar">
                    <div className={`gauge-fill ${g.cls}`} style={{ width: `${(g.value / maxGauge) * 100}%` }}></div>
                  </div>
                  <div className="gauge-val">{g.value}</div>
                </div>
              ))}
            </div>
            <div className="human-meter">
              <span className="human-label">人類滅ぼしゲージ</span>
              <div className="human-bar">
                <div className="human-fill" style={{ width: `${humanGaugeVal}%` }}></div>
              </div>
              <span className="human-val">{humanGaugeVal}/100</span>
            </div>
          </div>
          <div className="battle-scene">
            <div className="battle-clip left-offset" style={clipStyle}>
              <div className="battle-guide" style={guideStyle}></div>
              {canvasItems.map((c) => (
                <div
                  key={c.id}
                  className="battle-item"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    "--scale": c.scale || 1,
                  }}
                >
                  <img src={c.img} alt={c.name} draggable={false} />
                </div>
              ))}
            </div>
          </div>
        {!enemyPlaced && (
          <button className="battle-start-btn" onClick={() => setEnemyPlaced(true)}>戦闘開始！</button>
        )}
        {enemyPlaced && (
          <div className="battle-enemy">
            <img src="/enemy/人類.png" alt="人類" />
          </div>
        )}
        </div>
      );
    }

    if (result.type === "canvas") return (
      <div className="canvas-blank" ref={canvasRef} onDragOver={handleCanvasDragOver} onDrop={handleCanvasDrop} onDragLeave={handleCanvasDragLeave}>
        <div
          className="canvas-board"
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          onDragLeave={handleCanvasDragLeave}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={handleCanvasBackgroundClick}
        >
          {canvasItems.map((c) => (
            <div
              key={c.id}
              className={`canvas-item ${selectedId === c.id ? "selected" : ""}`}
              style={{ left: `${c.x}%`, top: `${c.y}%`, "--scale": c.scale || 1 }}
              onMouseDown={(e) => handleCanvasItemMouseDown(c, e)}
            >
              <img src={c.img} alt={c.name} draggable={false} />
              <div className="resize-handle" onMouseDown={(e) => startResize(c, e)}></div>
            </div>
          ))}
          {previewPos && previewItem && (
            <div className="canvas-guide" style={{ left: `${previewPos.x}%`, top: `${previewPos.y}%` }}>
              <img src={previewItem.img} alt={previewItem.name} draggable={false} />
            </div>
          )}
          {canvasItems.length === 0 && <div className="canvas-hint">所持カード一覧をクリックして貼り付け</div>}
          <div className="canvas-battle-guide" style={squareGuide(canvasAspect)}></div>
        </div>
      </div>
    );

    if (result.type === "item" && result.item) {
      return (
        <div key={`result-${drawPulse}`} className="card with-image got draw-anim">
          <div className="thumb">
            <img src={result.item.img} alt={result.item.name} />
          </div>
          <div>
            <div className="item">{result.item.name}</div>
            <div className="meta">
              <span>回数… {result.count} 回</span>
              <span>時刻… {new Date(result.at).toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return <div className="small">作るボタンでガチャを回してください。</div>;
  })();

  const handleDexWheel = (e) => {
    if (activeTab === "catalog") {
      const body = catalogRef.current;
      const speed = Math.min(1, Math.abs(e.deltaY) / 400);
      const volume = 0.05 + 0.12 * speed;
      playSound("se7", volume);
      e.preventDefault();
      e.stopPropagation();
      if (body) body.scrollBy({ top: e.deltaY, behavior: "auto" });
    } else if (activeTab === "owned") {
      const area = ownedRef.current;
      const speed = Math.min(1, Math.abs(e.deltaY) / 400);
      const volume = 0.05 + 0.12 * speed;
      playSound("se7", volume);
      e.preventDefault();
      e.stopPropagation();
      if (area) area.scrollBy({ left: e.deltaY, behavior: "auto" });
    }
  };

  return (
    <>
      <audio ref={audioRefs.bgm} src="/bgm/bgm1.mp3" loop />
      <audio ref={audioRefs.se1} src="/se/se1.mp3" preload="auto" />
      <audio ref={audioRefs.se2} src="/se/se2.mp3" preload="auto" />
      <audio ref={audioRefs.se3} src="/se/se3.mp3" preload="auto" />
      <audio ref={audioRefs.se4} src="/se/se4.mp3" preload="auto" />
      <audio ref={audioRefs.se5} src="/se/se5.mp3" preload="auto" />
      <audio ref={audioRefs.se6} src="/se/se6.mp3" preload="auto" />
      <audio ref={audioRefs.se7} src="/se/se7.mp3" preload="auto" />

      <div className="wrap">
        <h1>ロボットコージョー ガチャ</h1>

        <div className="machine-shell">
          <div className="side-panel left"><div className="side-window"></div></div>
          <div className="side-panel right"><div className="side-window"></div></div>
          <div className="hazard-bar"></div>

          <div className="panel">
            <div className="monitor-bar">
              <button className="monitor-btn" id="drawBtn" onMouseEnter={() => playSound("se3", 0.65)} onClick={handleDraw}>作る</button>
              <button className="monitor-btn" id="assembleBtn" onClick={handleAssemble}>組み立てる</button>
              <button className="monitor-btn" id="battleBtn" onClick={handleBattle}>戦闘</button>
            </div>

            <div className="monitor-screen">
              <div className="monitor-bezel">
                <div className={`screen-inner ${mode === "canvas" ? "canvas-mode" : ""} ${mode === "battle" ? "battle-mode" : ""}`} onDragOver={mode === "canvas" ? handleCanvasDragOver : undefined} onDrop={mode === "canvas" ? handleCanvasDrop : undefined}>
                  {mode === "normal" && <div className="screen-noise"></div>}
                  <div className={`result ${mode === "canvas" ? "canvas-mode" : ""}`} id="result" onDragOver={mode === "canvas" ? handleCanvasDragOver : undefined} onDrop={mode === "canvas" ? handleCanvasDrop : undefined}>
                    {resultNode}
                  </div>
                </div>
                <div className="console">
                  <div className="lamp red" onMouseEnter={() => setHoverStat(`攻撃力: ${canvasTotals.red}`)} onMouseLeave={() => setHoverStat("")} title={`攻撃力: ${canvasTotals.red}`}></div>
                  <div className="lamp amber" onMouseEnter={() => setHoverStat(`滅ぼし力: ${canvasTotals.orange}`)} onMouseLeave={() => setHoverStat("")} title={`滅ぼし力: ${canvasTotals.orange}`}></div>
                  <div className="lamp green" onMouseEnter={() => setHoverStat(`体力: ${canvasTotals.green}`)} onMouseLeave={() => setHoverStat("")} title={`体力: ${canvasTotals.green}`}></div>
                  <div className="lamp blue" onMouseEnter={() => setHoverStat(`行動力: ${canvasTotals.cyan}`)} onMouseLeave={() => setHoverStat("")} title={`行動力: ${canvasTotals.cyan}`}></div>
                  <div className="stat-hover-text">{hoverStat}</div>
                  <button className="toggle" onClick={() => setBgmOn((v) => !v)}>{bgmOn ? "BGM: ON" : "BGM: OFF"}</button>
                  <div className="volume">
                    <label htmlFor="vol">音量</label>
                    <input
                      type="range"
                      id="vol"
                      min="0"
                      max="1"
                      step="0.01"
                      value={bgmVol}
                      onChange={(e) => setBgmVol(Number(e.target.value))}
                    />
                  </div>
                  <button className="toggle" onClick={handleGacha}>ガチャ</button>
                  <button className="toggle" onClick={handleUnlockAll}>全キャラ入手</button>
                </div>
              </div>
            </div>

            <div className="dex-monitor">
              <div className="dex-header">
                <div className="tab-bar">
                  <button className={`tab-btn ${activeTab === "catalog" ? "active" : ""}`} onClick={() => setActiveTab("catalog")}>足立図鑑</button>
                  <button className={`tab-btn ${activeTab === "owned" ? "active" : ""}`} onClick={() => setActiveTab("owned")}>所持カード一覧</button>
                  <button className={`tab-btn ${activeTab === "ach" ? "active" : ""}`} onClick={() => setActiveTab("ach")}>実績</button>
                </div>
                <div className="dex-stats">制作済み <span>{Object.keys(drawnMap).length}</span> / <span>{ITEMS.length}</span></div>
              </div>
              <div className={`dex-body ${activeTab === "owned" ? "owned-no-scroll" : ""}`} ref={dexBodyRef}>
                <div className={`tab-panel ${activeTab === "catalog" ? "active" : ""}`} id="tab-catalog">
                  <div className="history" style={{ maxHeight: '360px', overflowY: 'auto' }} ref={catalogRef} onWheel={handleDexWheel}>
                    <div className="list" id="history" ref={historyRef}>{historyList}</div>
                  </div>
                </div>
                <div className={`tab-panel ${activeTab === "owned" ? "active" : ""}`} id="tab-owned" onWheelCapture={handleDexWheel}>
                  <div className="owned-selected-name">{ownedTitle || ""}</div>
                  <div className="owned-selected-stats">
                    {ownedStats ? (
                      <div className="stat-row">
                        <div className="stat-led red"><span className="dot"></span><span>{STAT_LABELS.red}: {ownedStats.red}</span></div>
                        <div className="stat-led orange"><span className="dot"></span><span>{STAT_LABELS.orange}: {ownedStats.orange}</span></div>
                        <div className="stat-led green"><span className="dot"></span><span>{STAT_LABELS.green}: {ownedStats.green}</span></div>
                        <div className="stat-led cyan"><span className="dot"></span><span>{STAT_LABELS.cyan}: {ownedStats.cyan}</span></div>
                      </div>
                    ) : ""}
                  </div>
                  <div className="owned-stack" onWheelCapture={handleDexWheel}>
                    <div className="stack-area" id="ownedStack" ref={ownedRef} onWheelCapture={handleDexWheel} onMouseMove={handleOwnedMouseMove} onMouseLeave={() => setOwnedHover(null)}>
                      {ownedStack}
                    </div>
                  </div>
                </div>
                <div className={`tab-panel ${activeTab === "ach" ? "active" : ""}`} id="tab-achievements">
                  <div className="small" style={{ padding: "12px" }}>実績は準備中です。</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="small" style={{ marginTop: 24 }}>
          これはクライアントだけで動く簡易ガチャです。全て引くと終了します。画像は入手済みカードからダウンロードできます。
        </p>
      </div>

      {modalImg && (
        <div className="modal show" onClick={() => setModalImg(null)}>
          <div className="modal-content">
            <img src={modalImg} alt="modal" />
          </div>
        </div>
      )}
    </>
  );
}
export default App;
































