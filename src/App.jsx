import { useEffect, useMemo, useRef, useState } from "react";

import "./styles.css";
const STAT_LABELS = { red: "攻撃力", orange: "滅ぼし力", green: "体力", cyan: "行動力", silver: "防御力" };


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



const BASE_00_PREFIX = "00";
const BASE_00_STATS = { red: 10, orange: 10, green: 100, cyan: 20, silver: 20 };

const RARITY_BUCKETS = [
  { rarity: "☆☆☆☆☆", count: 10 },
  { rarity: "☆☆☆☆", count: 20 },
  { rarity: "☆☆☆", count: 20 },
  { rarity: "☆☆", count: 20 },
  { rarity: "☆", count: Infinity },
];
const RARITY_MULTIPLIER = { "☆": 1, "☆☆": 1.5, "☆☆☆": 2, "☆☆☆☆": 3, "☆☆☆☆☆": 4 };

const xmur3 = (str) => {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
};

const mulberry32 = (a) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const rngFromString = (seedStr) => mulberry32(xmur3(seedStr)());

const shuffleInPlace = (arr, rng) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const rarityByKey = (() => {
  const keys = FILES
    .filter((file) => !file.startsWith(BASE_00_PREFIX))
    .map((file) => file.replace(/\.png$/i, ""));

  shuffleInPlace(keys, rngFromString("rarity-v1"));

  const map = {};
  let cursor = 0;
  for (const bucket of RARITY_BUCKETS) {
    const remain = keys.length - cursor;
    if (remain <= 0) break;
    const take = bucket.count === Infinity ? remain : Math.min(bucket.count, remain);
    for (let i = 0; i < take; i++) {
      map[keys[cursor++]] = bucket.rarity;
    }
  }
  return map;
})();

const rollStat = (base, mult, rng, spread = 0.15) => {
  const lo = Math.max(1, mult * (1 - spread));
  const hi = mult * (1 + spread);
  const m = lo + (hi - lo) * rng();
  return Math.max(base, Math.round(base * m));
};

const rollStats = (key, rarity) => {
  const mult = RARITY_MULTIPLIER[rarity] ?? 1;
  const rng = rngFromString("stats-v1|" + key + "|" + rarity);
  const is00 = key.startsWith(BASE_00_PREFIX);
  const baseCyan = is00 ? BASE_00_STATS.cyan : 10;
  const baseSilver = is00 ? BASE_00_STATS.silver : 10;
  const wide = 0.45; // 行動力・防御力は振れ幅を大きく
  return {
    red: rollStat(BASE_00_STATS.red, mult, rng),
    orange: 10, // 滅ぼし力は一律10
    green: rollStat(BASE_00_STATS.green, mult, rng),
    cyan: rollStat(baseCyan, mult, rng, wide),
    silver: rollStat(baseSilver, mult, rng, wide),
  };
};

// 防御力による被ダメージ補正（100で等倍、20で5倍、200で0.5倍）
const calcDamageTaken = (rawDmg, defense) => {
  const def = Math.max(1, defense || 0);
  const mult = 100 / def;
  return Math.max(0, Math.ceil(rawDmg * mult));
};

const enemyImages = import.meta.glob('/enemy/*.png', { eager: true, as: 'url' });
const ITEMS = FILES.map((file, idx) => {
  const base = file.replace(/\.png$/i, "");
  const m = base.match(/^(\d{1,3})/);
  const order = m ? Number(m[1]) : 1000 + idx;
  const key = base;
  const name = base;
  const is00 = file.startsWith(BASE_00_PREFIX);
  const rarity = is00 ? "??" : (rarityByKey[key] || "☆");
  const stats = is00 ? { ...BASE_00_STATS } : rollStats(key, rarity);
  let skill;
  if (is00) {
    skill = { name: "人類滅ぼしパンチ", desc: "攻撃力依存、200%のダメージ", cost: 1 };
  }
  return { key, name, img: "/images/" + file, order, idx, stats, rarity, skill };
}).sort((a, b) => (a.order === b.order ? a.idx - b.idx : a.order - b.order));


const LS_DRAWN = "gacha_drawn_map_v1";
const LS_COUNT = "gacha_count_v3";
const LS_COUNTS = "gacha_card_counts_v1";
const LS_CANVAS = "gacha_canvas_v1";
const MATERIAL_COST = 100;
const INITIAL_MATERIAL = 180;
const MAX_CANVAS_RARITY = 20;
const DRAW_SETTLE_MS_NEW = 1200;
const DRAW_SETTLE_MS_DUP = 650;
const MULTI_DRAW_COUNT = 10;

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
  const [gameOver, setGameOver] = useState({ visible: false, floor: 1 });
  const [confirmExit, setConfirmExit] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [bgmOn, setBgmOn] = useState(true);
  const [bgmVol, setBgmVol] = useState(0.4);
  const [lastDrawnName, setLastDrawnName] = useState(null);
  const [shakeName, setShakeName] = useState(null);
  const [drawPulse, setDrawPulse] = useState(0);
  const [showAnother, setShowAnother] = useState(false);
  const [ownedHover, setOwnedHover] = useState(null);
  const [materials, setMaterials] = useState(INITIAL_MATERIAL);
  const [enemyPlaced, setEnemyPlaced] = useState(false);
  const [floor, setFloor] = useState(1);
  const [enemyRoster, setEnemyRoster] = useState([]);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyDying, setEnemyDying] = useState(false);
  const [inBattlePhase, setInBattlePhase] = useState(false);
  const [canvasItems, setCanvasItems] = useState([]);
  const [hoverStat, setHoverStat] = useState("");
  const [previewPos, setPreviewPos] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasAspect, setCanvasAspect] = useState(16 / 9);
  const [humanGauge, setHumanGauge] = useState(0);
  const [humanPoints, setHumanPoints] = useState(0);
  const [holoPulse, setHoloPulse] = useState(false);
  const [handCards, setHandCards] = useState(Array(5).fill(null));
  const humanGaugeRef = useRef(0);
  const [enemyHP, setEnemyHP] = useState(100);
  const [enemyMaxHP, setEnemyMaxHP] = useState(100);
  const [enemyHpLag, setEnemyHpLag] = useState(100);
  const [allyHP, setAllyHP] = useState(0);
  const [allyMaxHP, setAllyMaxHP] = useState(0);
  const [allyHpLag, setAllyHpLag] = useState(0);
  const [enemyAtk, setEnemyAtk] = useState(10);
  const [enemyAct, setEnemyAct] = useState(10);
  const [enemyDef, setEnemyDef] = useState(20);
  const [enemyHitPulse, setEnemyHitPulse] = useState(0);
  const [allyHitPulse, setAllyHitPulse] = useState(0);
  const [enemyLastDmg, setEnemyLastDmg] = useState(0);
  const [allyLastDmg, setAllyLastDmg] = useState(0);
  const [skillNotes, setSkillNotes] = useState([]);
  const enemyHPRef = useRef(enemyHP);
  const allyHPRef = useRef(allyHP);
  const battleTimerRef = useRef(null);
  const enemyTimerRef = useRef(null);
  const prevHumanPointsRef = useRef(humanPoints);
  const [allyProgress, setAllyProgress] = useState(0);
  const [enemyProgress, setEnemyProgress] = useState(0);
  const listCycleRef = useRef({});
  const hitCycleRef = useRef({ key: "", count: 0 });

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


  const clearBattleTimers = () => {
    if (battleTimerRef.current) {
      clearInterval(battleTimerRef.current);
      battleTimerRef.current = null;
    }
    if (enemyTimerRef?.current) {
      clearInterval(enemyTimerRef.current);
      enemyTimerRef.current = null;
    }
  };

  
  
  function triggerGameOver() {
    setGameOver({ visible: true, floor });
    clearBattleTimers();
    setInBattlePhase(false);
    setMode("battle");
    setEnemyPlaced(true);
    setEnemyDying(false);
    setEnemyHP(0);
  }

const loadEnemies = () => {
    const roster = Object.keys(enemyImages).map((path, idx) => {
      const name = path.split("/").pop();
      const baseHP = 80 + (idx * 13) % 50;
      const baseAtk = 8 + (idx * 7) % 10;
      const baseAct = 8 + (idx * 5) % 10;
      const baseDef = 70 + (idx * 9) % 70; // 70-139付近で防御をばらつかせる
      return { key: name, img: enemyImages[path] || `/enemy/${name}`, baseHP, baseAtk, baseAct, baseDef };
    });
    setEnemyRoster(roster);
    return roster;
  };

  const calcEnemyStats = (enemy, floorNum) => {
    const baseHP = enemy.baseHP;
    const baseAtk = enemy.baseAtk;
    const baseAct = enemy.baseAct;
    const baseDef = enemy.baseDef ?? 100;
    let mult = 1 + 0.5 * Math.max(0, floorNum - 1);
    if (floorNum % 10 === 0) mult *= 3.0; // ボス強化
    else if (floorNum % 5 === 0) mult *= 2.0; // 中ボス強化
    return {
      hp: Math.max(1, Math.round(baseHP * mult)),
      atk: Math.max(1, Math.round(baseAtk * mult)),
      act: Math.max(1, Math.round(baseAct * mult)),
      def: Math.max(1, Math.round(baseDef * mult)),
      mult,
    };
  };


  function handleEnemyDefeat() {
    const multInfo = currentEnemy ? calcEnemyStats(currentEnemy, floor).mult : 1;
    const drop = Math.max(1, Math.round(20 * multInfo));
    setMaterials((m) => m + drop);
    const nextFloor = floor + 1;
    setFloor(nextFloor);
    clearBattleTimers();
    setEnemyPlaced(false);
    setEnemyDying(true);
    setTimeout(() => {
      spawnEnemy(nextFloor);
    }, 800);
  }

const spawnEnemy = (floorNum) => {
    setEnemyDying(false);
    const roster = enemyRoster.length ? enemyRoster : loadEnemies();
    const pick = roster[Math.floor(Math.random() * roster.length)];
    const targetFloor = floorNum ?? floor;
    const stats = calcEnemyStats(pick, targetFloor);
    setCurrentEnemy(pick);
    setEnemyHP(stats.hp);
    setEnemyMaxHP(stats.hp);
    setEnemyHpLag(stats.hp);
    setEnemyAtk(stats.atk);
    setEnemyAct(stats.act);
    setEnemyDef(stats.def);
    setEnemyHitPulse(0);
    setEnemyLastDmg(0);
    setEnemyPlaced(true);
  };

  
  useEffect(() => { enemyHPRef.current = enemyHP; }, [enemyHP]);
  useEffect(() => { allyHPRef.current = allyHP; }, [allyHP]);
  useEffect(() => { humanGaugeRef.current = humanGauge; }, [humanGauge]);
  useEffect(() => {
    if (humanPoints > prevHumanPointsRef.current) {
      setHoloPulse(true);
      const timer = setTimeout(() => setHoloPulse(false), 500);
      prevHumanPointsRef.current = humanPoints;
      return () => clearTimeout(timer);
    }
    prevHumanPointsRef.current = humanPoints;
  }, [humanPoints]);


  useEffect(() => {
    if (enemyHitPulse) {
      const timer = setTimeout(() => setEnemyHitPulse(0), 320);
      return () => clearTimeout(timer);
    }
  }, [enemyHitPulse]);
  useEffect(() => {
    if (allyHitPulse) {
      const timer = setTimeout(() => setAllyHitPulse(0), 500);
      return () => clearTimeout(timer);
    }
  }, [allyHitPulse]);
  useEffect(() => {
    let t;
    setEnemyHpLag((prev) => {
      if (enemyHP >= prev) return enemyHP;
      t = setTimeout(() => setEnemyHpLag(enemyHP), 200);
      return prev;
    });
    return () => t && clearTimeout(t);
  }, [enemyHP]);
  useEffect(() => {
    let t;
    setAllyHpLag((prev) => {
      if (allyHP >= prev) return allyHP;
      t = setTimeout(() => setAllyHpLag(allyHP), 200);
      return prev;
    });
    return () => t && clearTimeout(t);
  }, [allyHP]);
  useEffect(() => {
    if (allyHitPulse) {
      const timer = setTimeout(() => setAllyHitPulse(0), 500);
      return () => clearTimeout(timer);
    }
  }, [allyHitPulse]);

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
    const savedMat = localStorage.getItem("materials");
    if (savedMat) setMaterials(Number(savedMat));
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
    localStorage.setItem("materials", String(materials));
  }, [canvasItems, materials]);



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

  useEffect(() => {
    if (result?.type === "item") {
      const isNew = Boolean(result.isNew);
      const delay = isNew ? DRAW_SETTLE_MS_NEW : DRAW_SETTLE_MS_DUP;
      if (!isNew) {
        setShowAnother(true);
      } else {
        setShowAnother(false);
      }
      const timer = setTimeout(() => setShowAnother(true), delay);
      return () => clearTimeout(timer);
    }
    setShowAnother(false);
  }, [result, drawPulse]);
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

  useEffect(() => {
    if (mode !== "battle") {
      clearBattleTimers();
      setInBattlePhase(false);
      setAllyProgress(0);
      setEnemyProgress(0);
      setEnemyPlaced(false);
      setEnemyDying(false);
      setEnemyHP(100);
      setGameOver({ visible: false, floor: 1 });
      setFloor(1);
      setPendingNav(null);
      setConfirmExit(false);
      setEnemyMaxHP(100);
      setEnemyAtk(10);
      setEnemyAct(10);
      setEnemyDef(20);
      setHumanGauge(0);
      setHumanPoints(0);
      setHandCards([]);
      setSkillNotes([]);
      setAllyHP(0);
      setAllyMaxHP(0);
    }
  }, [mode]);

    const scrollToHistory = (name) => {
    const body = catalogRef.current || dexBodyRef.current;
    const list = historyRef.current;
    if (!body || !list) return;
    const card = list.querySelector(`[data-name="${name}"]`);
    if (!card) return;
    const top = card.offsetTop - 8;
    body.scrollTo({ top, behavior: "smooth" });
  };

  const handleDrawCore = () => {
    setMode("normal");
    setActiveTab("catalog");
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
    setMaterials((m) => {
      if (m < MATERIAL_COST) {
        playSound("se5", 0.75);
        return m;
      }
      playSound("se6", 0.8);
      const isFirstDraw = drawCount === 0;
      const firstItem = ITEMS.find((i) => i.key.startsWith("00"));
      const item = isFirstDraw && firstItem ? firstItem : randItem();
      const now = Date.now();
      const isNew = !drawnMap[item.key];
      setDrawnMap((prev) => ({ ...prev, [item.key]: prev[item.key] || now }));
      setCountsMap((prev) => ({ ...prev, [item.key]: (prev[item.key] || 0) + 1 }));
      const nextCount = drawCount + 1;
      setDrawCount(nextCount);
      setResult({ type: "item", item, at: now, count: nextCount, isNew });
      setLastDrawnName(item.key);
      setDrawPulse((p) => p + 1);
      setShowAnother(!isNew); // 重複カードは即座に左寄せ＋再抽選準備
      return m - MATERIAL_COST;
    });
  };;

  const handleGachaMulti = (times = MULTI_DRAW_COUNT) => {
    const need = MATERIAL_COST * times;
    if (materials < need) {
      playSound("se5", 0.8);
      return;
    }
    // まとめて回す: 時間差で単発を複数呼び出し（最終結果のみ画面に残る）
    for (let i = 0; i < times; i += 1) {
      setTimeout(() => handleGacha(), i * 60);
    }
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

  const handleResetData = () => {
    clearBattleTimers();
    localStorage.removeItem(LS_DRAWN);
    localStorage.removeItem(LS_COUNT);
    localStorage.removeItem(LS_COUNTS);
    localStorage.removeItem(LS_CANVAS);
    localStorage.removeItem("materials");
    setDrawnMap({});
    setCountsMap({});
    setDrawCount(0);
    setCanvasItems([]);
    setMaterials(INITIAL_MATERIAL);
    setResult({ type: "message" });
    setMode("normal");
    setActiveTab("catalog");
    setPreviewPos(null);
    setPreviewItem(null);
    setSelectedId(null);
    setIsDragging(false);
    setShowAnother(false);
    setLastDrawnName(null);
    setHandCards(Array(5).fill(null));
    setSkillNotes([]);
    setHumanGauge(0);
    setHumanPoints(0);
    humanGaugeRef.current = 0;
    prevHumanPointsRef.current = 0;
    setInBattlePhase(false);
    setEnemyPlaced(false);
    setEnemyDying(false);
    setEnemyHP(100);
    setEnemyMaxHP(100);
    setEnemyHpLag(100);
    enemyHPRef.current = 100;
    setAllyHP(0);
    setAllyMaxHP(0);
    setAllyHpLag(0);
    allyHPRef.current = 0;
    setEnemyAtk(10);
    setEnemyAct(10);
    setEnemyDef(20);
    setEnemyProgress(0);
    setAllyProgress(0);
    setEnemyRoster([]);
    setCurrentEnemy(null);
    setFloor(1);
    setGameOver({ visible: false, floor: 1 });
    setConfirmExit(false);
    setPendingNav(null);
  };

    const handleNavWithConfirm = (target) => {
    if (mode === "battle" && inBattlePhase) {
      setConfirmExit(true);
      setPendingNav(target);
      return;
    }
    if (target === "draw") handleDrawCore();
    else if (target === "assemble") handleAssembleCore();
  };

const handleAssembleCore = () => {
    playSound("se6", 0.6);
    setMode("canvas");
    setActiveTab("owned");
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

  const padHand = (arr) => {
    const next = [...arr];
    while (next.length < 5) next.push(null);
    return next;
  };

  const countHandSkills = (arr) => {
    return arr.reduce((acc, card) => {
      const skillName = card?.skill?.name;
      if (!skillName) return acc;
      acc[skillName] = (acc[skillName] || 0) + 1;
      return acc;
    }, {});
  };

  const handleSkillPlay = (card, index) => {
    if (mode !== "battle" || !card) return;
    const cost = card?.skill?.cost ?? 1;
    if (humanPoints < cost) { playSound("se5", 0.7); return; }
    setHumanPoints((p) => Math.max(0, p - cost));
    const dmg = calcDamageTaken(Math.max(0, Math.floor(canvasTotals.red * 2)), enemyDef);
    const note = {
      id: Date.now(),
      lines: [
        `${card.name} の`,
        `${card.skill?.name || "不明スキル"}！`,
        `敵に ${dmg} ダメージ`,
      ],
    };
    setSkillNotes((prev) => {
      const next = [note, ...prev];
      return next.slice(0, 2);
    });
    playSound("se4", 0.7);
    setHandCards((prev) => {
      const next = padHand(prev);
      next[index] = null;
      return next;
    });
    setEnemyHP((hp) => {
      if (hp <= 0) return hp;
      const next = Math.max(0, hp - dmg);
      setEnemyLastDmg(dmg);
      setEnemyHitPulse((v) => v + 1);
      if (next <= 0) {
        handleEnemyDefeat();
      }
      return next;
    });
  };

  
  const handleDraw = () => handleNavWithConfirm("draw");
  const handleAssemble = () => handleNavWithConfirm("assemble");

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

  const handleHoloDraw = () => {
    if (mode !== "battle") return;
    if (humanPoints < 1) { playSound("se5", 0.7); return; }
    const slotIdx = padHand(handCards).findIndex((c) => !c);
    if (slotIdx === -1) { playSound("se5", 0.7); return; }
    const withSkill = canvasItems
      .map((c) => lookupItem(c.name))
      .filter((m) => m?.skill?.name);
    if (!withSkill.length) { playSound("se5", 0.7); return; }

    const canvasSkillCounts = withSkill.reduce((acc, meta) => {
      const skillName = meta.skill.name;
      acc[skillName] = (acc[skillName] || 0) + 1;
      return acc;
    }, {});

    let added = false;
    setHandCards((prev) => {
      const next = padHand(prev);
      const emptyIdx = next.findIndex((c) => !c);
      if (emptyIdx === -1) return next;

      const handSkillCounts = countHandSkills(next);
      const eligible = withSkill.filter((meta) => {
        const skillName = meta.skill.name;
        const allowed = canvasSkillCounts[skillName] || 0;
        const inHand = handSkillCounts[skillName] || 0;
        return allowed > inHand;
      });
      if (!eligible.length) return next;

      const pick = eligible[Math.floor(Math.random() * eligible.length)];
      next[emptyIdx] = { name: pick.name, skill: pick.skill };
      added = true;
      return next;
    });
    if (added) {
      setHumanPoints((p) => Math.max(0, p - 1));
    } else {
      playSound("se5", 0.7);
    }
  };

  const ownedItems = useMemo(() => ITEMS.filter((i) => countsMap[i.key]), [countsMap]);
  const placedCountMap = useMemo(() => {
    return canvasItems.reduce((acc, c) => {
      const key = c.name;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [canvasItems]);
  const availableCount = (key) => {
    const owned = countsMap[key] || 0;
    const placed = placedCountMap[key] || 0;
    return Math.max(0, owned - placed);
  };
  const hoveredIdx = ownedItems.findIndex((i) => i.key === ownedHover);

  const CANVAS_MARGIN_X = 12;  // 横方向の余白％（飛び出し防止を強め）
  const CANVAS_MARGIN_Y = 29;  // 縦方向の余白％（飛び出し防止を強め）
  const clampX = (v) => Math.min(100 - CANVAS_MARGIN_X, Math.max(CANVAS_MARGIN_X, v));
  const clampY = (v) => Math.min(100 - CANVAS_MARGIN_Y, Math.max(CANVAS_MARGIN_Y, v));
  const getHitStack = (clientX, clientY) => {
    const els = document.elementsFromPoint(clientX, clientY) || [];
    const ids = [];
    els.forEach((el) => {
      if (el?.classList?.contains("canvas-item")) {
        const id = el.getAttribute("data-id");
        if (id && !ids.includes(id)) ids.push(id);
      }
    });
    return ids;
  };
  const cycleSelectFromHits = (hitIds) => {
    if (!hitIds.length) return null;
    const key = hitIds.join("|");
    const sameStack = hitCycleRef.current.key === key;
    const nextCount = sameStack ? hitCycleRef.current.count + 1 : 1;
    hitCycleRef.current = { key, count: nextCount };
    const current = selectedId && hitIds.includes(selectedId) ? selectedId : hitIds[0];
    // 3回目ごとに奥へ送る。それまでは最前面を維持。
    const shouldCycle = nextCount > 0 && nextCount % 3 === 0;
    const targetIdx = hitIds.indexOf(current);
    const nextIdx = shouldCycle ? ((targetIdx >= 0 ? targetIdx : -1) + 1) % hitIds.length : (targetIdx >= 0 ? targetIdx : 0);
    const pick = hitIds[nextIdx];
    setSelectedId(pick);
    return pick;
  };
  const cycleSelectByName = (name) => {
    const matches = canvasItems.filter((c) => c.name === name);
    if (!matches.length) return null;
    const last = listCycleRef.current[name] ?? -1;
    const next = (last + 1) % matches.length;
    listCycleRef.current[name] = next;
    const pick = matches[next];
    setSelectedId(pick.id);
    return pick.id;
  };

  const addToCanvas = (item, xPerc, yPerc) => {
    if (mode !== "canvas") return;
    const itemKey = item.key || item.name;
    const ownedCount = countsMap[itemKey] || 0;
    setCanvasItems((prev) => {
      const meta = lookupItem(item.name) || item;
      const rarityCost = rarityValue(meta);
      const currentRarity = computeRaritySum(prev);
      if (currentRarity + rarityCost > MAX_CANVAS_RARITY) {
        playSound("se5", 0.75);
        return prev;
      }
      const placedCount = prev.filter((c) => c.name === item.name).length;
      if (ownedCount <= placedCount) {
        playSound("se5", 0.75);
        return prev;
      }
      const spanX = 100 - CANVAS_MARGIN_X * 2;
      const spanY = 100 - CANVAS_MARGIN_Y * 2;
      const x = xPerc == null ? Math.random() * spanX + CANVAS_MARGIN_X : clampX(xPerc);
      const y = yPerc == null ? Math.random() * spanY + CANVAS_MARGIN_Y : clampY(yPerc);
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          name: item.name,
          img: item.img,
          x,
          y,
          scale: 1,
        },
      ];
    });
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
    const hits = getHitStack(e.clientX, e.clientY);
    const targetId = hits.length ? cycleSelectFromHits(hits) : item.id;
    const targetItem = canvasItems.find((c) => c.id === targetId) || item;
    const rect = board.getBoundingClientRect();
    const pointerX = ((e.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((e.clientY - rect.top) / rect.height) * 100;
    const targetEl = targetId ? document.querySelector(`[data-id="${targetId}"]`) : null;
    const itemRect = targetEl?.getBoundingClientRect() || e.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      offsetX: pointerX - targetItem.x,
      offsetY: pointerY - targetItem.y,
      halfW: (itemRect.width / rect.width) * 50,
      halfH: (itemRect.height / rect.height) * 50,
    };
    window.addEventListener("mousemove", handleCanvasMouseMove);
    window.addEventListener("mouseup", handleCanvasMouseUp);
    setSelectedId(targetItem.id);
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
          <div className="count-badge">所持数: {availableCount(item.key)}</div>
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
    const remaining = availableCount(item.key);
    const depleted = remaining <= 0;
    const hasPlaced = canvasItems.some((c) => c.name === item.name);
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
    const topWithDeplete = top - lift + (depleted ? 12 : 0);
    return (
      <div
        key={item.key}
        className={`stack-card ${depleted ? "depleted" : ""}`}
        style={{ left: baseLeft + offset, top: topWithDeplete, zIndex: z, transform: `rotate(${rot}deg) scale(${scale})`, cursor: mode === "canvas" ? (depleted ? "not-allowed" : "grab") : "default" }}
        data-name={item.key}
        draggable={mode === "canvas" && !depleted}
        onMouseEnter={() => { setSelectedId(null); setOwnedHover(item.key); }}
        onMouseLeave={handleOwnedCardLeave}
        onDragStart={(e) => handleDragStart(item, e)}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (mode === "canvas") {
            const selected = cycleSelectByName(item.name);
            if (selected) {
              playSound("se4", 0.55);
              return;
            }
            if (!depleted) {
              addToCanvas(item);
              playSound("se4", 0.65);
            } else {
              playSound("se5", 0.7);
            }
          }
        }}
      >
        <img src={item.img} alt={item.name} draggable={false} />
        <div className="count-badge" style={{ right: 8, bottom: 8 }}>
          x{remaining}
        </div>
      </div>
    );
  });

  const hoveredName = ownedHover ? (ITEMS.find((i) => i.key === ownedHover)?.name || "") : "";
  const ownedTitle = selectedId ? (canvasItems.find((c) => c.id === selectedId)?.name || "") : hoveredName;
  const lookupStats = (keyOrName) => ITEMS.find((i) => i.key === keyOrName || i.name === keyOrName)?.stats;
  const lookupItem = (keyOrName) => ITEMS.find((i) => i.key === keyOrName || i.name === keyOrName);
  const ownedStats = selectedId ? lookupStats(canvasItems.find((c) => c.id === selectedId)?.name) : lookupStats(ownedHover);
  const ownedMeta = selectedId ? lookupItem(canvasItems.find((c) => c.id === selectedId)?.name) : lookupItem(ownedHover);
  const rarityValue = (itemMeta) => {
    if (!itemMeta) return 1;
    const r = itemMeta.rarity;
    if (!r) return 1;
    if (typeof r === "number" && Number.isFinite(r)) return Math.max(1, r);
    const starCount = String(r).match(/☆/g)?.length;
    if (starCount && starCount > 0) return starCount;
    if (r === "??") return 2;
    const num = parseInt(String(r).replace(/\D/g, ""), 10);
    if (!Number.isNaN(num)) return Math.max(1, num);
    return 1;
  };
  const computeRaritySum = (list) => {
    return list.reduce((acc, c) => {
      const meta = lookupItem(c.name) || c;
      return acc + rarityValue(meta);
    }, 0);
  };
  const canvasRaritySum = useMemo(() => computeRaritySum(canvasItems), [canvasItems]);

  const canvasCountLabel = `☆${String(Math.min(canvasRaritySum, MAX_CANVAS_RARITY)).padStart(2, "0")}/☆${MAX_CANVAS_RARITY}`;
  const canvasTotals = useMemo(() => {
    return canvasItems.reduce((acc, c) => {
      const st = lookupStats(c.name);
      if (st) {
        acc.red += st.red || 0;
        acc.orange += st.orange || 0;
        acc.green += st.green || 0;
        acc.cyan += st.cyan || 0;
        acc.silver += st.silver || 0;
      }
      return acc;
    }, { red: 0, orange: 0, green: 0, cyan: 0, silver: 0 });
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
      const humanGaugeMax = 100;
      const humanGaugeVal = Math.min(humanGaugeMax, Math.max(0, humanGauge));
      const healthVal = canvasTotals.green;
      const canBattle = healthVal > 0;
      return (
        <div className="battle-wrap">
          <div className="battle-scene">
            {allyMaxHP > 0 && (
              <div className={`ally-hp hud hud-top-left ${allyHitPulse ? "ally-hit" : ""}`}>
                <div className="ally-hp-bar">
                  <div className="ally-hp-back" style={{ width: `${Math.max(0, allyHpLag) / (allyMaxHP || 1) * 100}%` }}></div>
                  <div className="ally-hp-fill" style={{ width: `${Math.max(0, allyHP) / (allyMaxHP || 1) * 100}%` }}></div>
                </div>
                <div className="ally-hp-text">{allyHP} / {allyMaxHP}</div>
                <div className="ally-extra">
                  <div className="ally-action">
                    <span className="action-label">攻撃まで</span>
                    <div className="action-progress ally"><div className="action-fill" style={{ width: `${Math.min(100, allyProgress)}%` }}></div></div>
                  </div>
                  <div className="human-meter compact">
                    <span className="human-label">人類滅ぼしゲージ</span>
                    <div className="human-bar">
                      <div className="human-fill" style={{ width: `${humanGaugeVal}%` }}></div>
                    </div>
                    <span className="human-val">{humanGaugeVal}/100</span>
                    <span className="human-points">ポイント: {humanPoints}</span>
                  </div>
                </div>
              </div>
            )}
            {mode === "battle" && (enemyPlaced || enemyDying) && (
              <div className={`enemy-hp hud hud-top-out`}>
                <div className="skill-note-frame"></div>
                {skillNotes.map((note, idx) => (
                  <div
                    key={note.id}
                    className={`skill-note ${idx === 1 ? "older" : ""} slide-in`}
                    style={{ top: `${-80 - idx * 74}px`, transform: `translateX(${idx === 0 ? "0" : "-6px"})` }}
                  >
                    {note.lines.map((line, i2) => <div key={`sn-${note.id}-${i2}`}>{line}</div>)}
                  </div>
                ))}
                <div className="floor-label">人類 {floor}人目</div>
                <div className={`enemy-hp-main ${enemyHitPulse ? "hit" : ""}`}>
                  <div className="enemy-hp-bar">
                    <div className="enemy-hp-back" style={{ width: `${Math.max(0, enemyHpLag) / (enemyMaxHP || 1) * 100}%` }}></div>
                    <div className="enemy-hp-fill" style={{ width: `${Math.max(0, enemyHP) / (enemyMaxHP || 1) * 100}%` }}></div>
                  </div>
                  <div className="enemy-hp-text">{enemyHP} / {enemyMaxHP}</div>
                </div>
                <div className="action-progress"><div className="action-fill enemy" style={{ width: `${Math.min(100, enemyProgress)}%` }}></div></div>
              </div>
            )}
            <div className={`battle-clip left-offset ${allyHitPulse ? "ally-hit-img" : ""}`} style={clipStyle}>
              <div className="battle-guide" style={guideStyle}></div>
              {canvasItems.map((c) => (
                <div
                  key={c.id}
                  className="battle-item"
                  data-id={c.id}
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    "--scale": c.scale || 1,
                  }}
                >
                  <img src={c.img} alt={c.name} draggable={false} />
                </div>
              ))}
              {allyHitPulse ? <div className="ally-dmg ally-dmg-float">-{allyLastDmg}</div> : null}
            </div>
            {mode === "battle" && (enemyPlaced || enemyDying) && (
              <div className="battle-hand">
                <div className="hand-list">
                  {Array.from({ length: 5 }, (_, idx) => handCards[idx] || null).map((h, idx) => (
                    h ? (() => {
                      const cost = h.skill?.cost ?? 1;
                      const usable = humanPoints >= cost;
                      return (
                      <div className={`hand-card filled ${usable ? "" : "disabled"}`} key={`hand-${idx}`} onClick={() => handleSkillPlay(h, idx)}>
                        <div className="hand-name">{h.name}</div>
                        <div className="hand-skill">{h.skill?.name || "情報なし"}</div>
                        <div className="hand-cost">消費: {cost}</div>
                      </div>
                      );
                    })() : (
                      <div className="hand-card empty" key={`hand-empty-${idx}`}>
                        <div className="hand-name">空き</div>
                        <div className="hand-skill">滅ぼしドローで補充</div>
                      </div>
                    )
                  ))}
                </div>
                <button className={`toggle holo-draw-btn ${holoPulse ? "pulse" : ""}`} onClick={handleHoloDraw} disabled={humanPoints < 1}>滅ドロー ({Math.max(0, humanPoints)})</button>
              </div>
            )}
          </div>
        {!enemyPlaced && !enemyDying && (
          <button
            className={`battle-start-btn ${!canBattle ? "disabled" : ""}`}
            aria-disabled={!canBattle}
            onClick={() => {
              if (!canBattle) {
                playSound("se5", 0.75);
                return;
              }
              clearBattleTimers();
              setEnemyHP(100);
              setEnemyMaxHP(100);
              setEnemyAtk(10);
              setEnemyAct(10);
              setEnemyDef(20);
              setHumanGauge(0);
              setHumanPoints((v) => v);
              setAllyHP(canvasTotals.green);
              setAllyMaxHP(canvasTotals.green);
              setEnemyPlaced(true);
              setInBattlePhase(true);
            }}
          >戦闘開始！</button>
        )}
        {mode === "battle" && (enemyPlaced || enemyDying) && (
          <div className={`battle-enemy ${enemyDying ? "dying" : ""} ${enemyHitPulse ? "hit" : ""}`}>
            <img src={currentEnemy?.img || "/enemy/人類.png"} alt={currentEnemy?.key || "敵"} />
            {enemyHitPulse ? (
              <div key={enemyHitPulse} className="enemy-dmg enemy-dmg-float">-{enemyLastDmg}</div>
            ) : null}
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
              data-id={c.id}
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
      const drawnMeta = lookupItem(result.item.name) || {};
      const drawnStats = lookupStats(result.item.name);
      const isNewDraw = Boolean(result.isNew);
      const canShowAgain = showAnother;
      return (
        <div key={`result-${drawPulse}`} className={`result-grid ${canShowAgain ? "show-action" : ""}`}>
          <div className={`card with-image got draw-anim ${isNewDraw ? "new-card" : ""}`}>
            {isNewDraw && <div className="new-ribbon">NEW!</div>}
            <div className={`thumb ${isNewDraw ? "new-thumb" : ""}`}>
              <img src={result.item.img} alt={result.item.name} />
            </div>
            <div className="draw-info">
              <div className="item-row">
                <div className="item">{result.item.name}</div>
                {isNewDraw && <span className="new-chip">NEW!</span>}
              </div>
              <div className="draw-rare-line">{drawnMeta.rarity ? `レアリティ: ${drawnMeta.rarity}` : "レアリティ: 情報なし"}</div>
              {drawnStats ? (
                <div className="meta stats-line">
                  <span>{STAT_LABELS.red}: {drawnStats.red}</span>
                  <span>{STAT_LABELS.orange}: {drawnStats.orange}</span>
                  <span>{STAT_LABELS.green}: {drawnStats.green}</span>
                  <span>{STAT_LABELS.cyan}: {drawnStats.cyan}</span>
                  <span>{STAT_LABELS.silver}: {drawnStats.silver}</span>
                </div>
              ) : (
                <div className="meta stats-line">ステータス: 情報なし</div>
              )}
              <div className="meta skill-line">{drawnMeta.skill ? `滅ぼしスキル: ${drawnMeta.skill.name}（${drawnMeta.skill.desc}）` : "滅ぼしスキル: 情報なし"}</div>
              <div className="meta">
                <span>回数… {result.count} 回</span>
              <span>時刻… {new Date(result.at).toLocaleString()}</span>
              </div>
            </div>
          </div>
            <div className="draw-actions-stack">
              <div className={`draw-action ${canShowAgain ? "visible" : ""}`} aria-hidden={!canShowAgain}>
                <button className="cta-again" onClick={handleGacha} disabled={materials < MATERIAL_COST}>
                  <div className="cta-again-main">もう1体</div>
                  <div className="cta-again-sub">素材-100</div>
                </button>
                <div className="cta-note">素材: {materials}</div>
                {materials < MATERIAL_COST && <div className="cta-note warning">素材が足りません</div>}
              </div>
              <div className={`draw-action draw-multi ${canShowAgain ? "visible" : ""}`} aria-hidden={!canShowAgain}>
                <button
                  className="cta-again"
                  onClick={() => handleGachaMulti()}
                  disabled={materials < MATERIAL_COST * MULTI_DRAW_COUNT}
                >
                  <div className="cta-again-main">もう10体</div>
                  <div className="cta-again-sub">素材-{MATERIAL_COST * MULTI_DRAW_COUNT}</div>
                </button>
              </div>
            </div>
          </div>
      );
    }
    return (
      <div className="draw-empty">
        <button className="cta-large" onClick={handleGacha} disabled={materials < MATERIAL_COST}>
          <div className="cta-large-title">足立を作る</div>
          <div className="cta-large-sub">(素材-100)</div>
        </button>
        <div className="cta-note">素材: {materials}{materials < MATERIAL_COST ? " / 足りません" : ""}</div>
      </div>
    );
  })();




  useEffect(() => {
    if (mode !== "battle") {
      clearBattleTimers();
      return;
    }
    const allyInterval = Math.max(500, (canvasTotals.cyan > 0 ? (1000 * 100) / canvasTotals.cyan : 1000));
    const enemyInterval = enemyAct && enemyAct > 0 ? (1000 * (100 / enemyAct)) : 10000;
    let allyStart = Date.now();
    let enemyStart = Date.now();
    const allyTick = () => {
      allyStart = Date.now();
      if (!enemyPlaced) return;
      if (enemyHPRef.current <= 0) return;
      if (canvasTotals.red > 0) {
        setEnemyHP((hp) => {
          if (hp <= 0) return hp;
          const dmg = calcDamageTaken(canvasTotals.red, enemyDef);
          const next = Math.max(0, hp - dmg);
          setEnemyLastDmg(dmg);
          setEnemyHitPulse((v) => v + 1);
          if (next <= 0) {
            handleEnemyDefeat();
            return next;
          }
          return next;
        });
      }
      if (canvasTotals.orange > 0) {
        const total = humanGaugeRef.current + canvasTotals.orange;
        if (total >= 100) {
          const nextGauge = total % 100;
          setHumanGauge(nextGauge);
          humanGaugeRef.current = nextGauge;
          setHumanPoints((p) => p + 1);
        } else {
          setHumanGauge(total);
          humanGaugeRef.current = total;
        }
      }
    };
    const enemyTick = () => {
      enemyStart = Date.now();
      if (!enemyPlaced) return;
      if (enemyHPRef.current <= 0) return;
      setAllyHP((hp) => {
        if (hp <= 0) return hp;
        const dmg = calcDamageTaken(enemyAtk, canvasTotals.silver);
        const next = Math.max(0, hp - dmg);
        setAllyLastDmg(dmg);
        setAllyHitPulse((v) => v + 1);
        if (next <= 0) {
          triggerGameOver();
          return 0;
        }
        return next;
      });
    };
    battleTimerRef.current = setInterval(allyTick, allyInterval);
    enemyTimerRef.current = setInterval(enemyTick, enemyInterval);
    const progTimer = setInterval(() => {
      const now = Date.now();
      const allyProg = Math.min(100, ((now - allyStart) / allyInterval) * 100);
      const enemyProg = Math.min(100, ((now - enemyStart) / enemyInterval) * 100);
      setAllyProgress(allyProg);
      setEnemyProgress(enemyProg);
    }, 200);
    return () => {
      clearBattleTimers();
      clearInterval(progTimer);
      setAllyProgress(0);
      setEnemyProgress(0);
    };
  }, [mode, enemyPlaced, canvasTotals.red, canvasTotals.orange, canvasTotals.cyan, canvasTotals.silver, enemyAct, enemyAtk, enemyDef]);

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
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const speed = Math.min(1, Math.abs(delta) / 400);
      const volume = 0.05 + 0.12 * speed;
      playSound("se7", volume);
      e.preventDefault();
      e.stopPropagation();
      if (area) area.scrollBy({ left: delta, behavior: "auto" });
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
              <button className={`monitor-btn ${mode === "normal" ? "active" : "inactive"}`} id="drawBtn" onMouseEnter={() => playSound("se3", 0.65)} onClick={handleDraw}>作る</button>
              <button className={`monitor-btn ${mode === "canvas" ? "active" : "inactive"}`} id="assembleBtn" onClick={handleAssemble}>組み立てる</button>
              <button className={`monitor-btn ${mode === "battle" ? "active" : "inactive"}`} id="battleBtn" onClick={handleBattle}>滅ぼす</button>
            </div>

            <div className="monitor-screen">
              <div className="monitor-bezel">
                <div className={`screen-inner ${mode === "canvas" ? "canvas-mode" : ""} ${mode === "battle" ? "battle-mode" : ""} ${allyHitPulse && mode === "battle" ? "ally-hit-screen" : ""}`} onDragOver={mode === "canvas" ? handleCanvasDragOver : undefined} onDrop={mode === "canvas" ? handleCanvasDrop : undefined}>
                  {gameOver.visible && (
                    <div className="gameover-overlay" onClick={() => {
                      setGameOver({ visible: false, floor: 1 });
                      setFloor(1);
                      setMode("battle");
                      setEnemyPlaced(false);
                      setEnemyDying(false);
                      setEnemyHP(100);
                      setEnemyMaxHP(100);
                      setAllyHP(0);
                      setAllyMaxHP(0);
                      setHumanGauge(0);
                      setHumanPoints(0);
                      setHandCards([]);
                      setSkillNotes([]);
                    }}>
                      <div className="gameover-panel">
                        <div className="gameover-title">GAME OVER</div>
                        <div className="gameover-floor">到達人類: {gameOver.floor}人目</div>
                        <div className="gameover-hint">画面をクリックで戻る</div>
                      </div>
                    </div>
                  )}
                  {mode === "battle" && allyHitPulse ? <div key={`ally-flash-${allyHitPulse}`} className="ally-flash"></div> : null}
                  {mode === "normal" && <div className="screen-noise"></div>}
                  {mode === "canvas" && (
                  <div className="canvas-count-badge">{canvasCountLabel}</div>
                )}
                <div className={`result ${mode === "canvas" ? "canvas-mode" : ""}`} id="result" onDragOver={mode === "canvas" ? handleCanvasDragOver : undefined} onDrop={mode === "canvas" ? handleCanvasDrop : undefined}>
                    {resultNode}
                  </div>
                </div>
                <div className="console">
                  <div className="lamp red" onMouseEnter={() => setHoverStat(`攻撃力: ${canvasTotals.red}`)} onMouseLeave={() => setHoverStat("")} title={`攻撃力: ${canvasTotals.red}`}></div>
                  <div className="lamp amber" onMouseEnter={() => setHoverStat(`滅ぼし力: ${canvasTotals.orange}`)} onMouseLeave={() => setHoverStat("")} title={`滅ぼし力: ${canvasTotals.orange}`}></div>
                  <div className="lamp green" onMouseEnter={() => setHoverStat(`体力: ${canvasTotals.green}`)} onMouseLeave={() => setHoverStat("")} title={`体力: ${canvasTotals.green}`}></div>
                  <div className="lamp blue" onMouseEnter={() => setHoverStat(`行動力: ${canvasTotals.cyan}`)} onMouseLeave={() => setHoverStat("")} title={`行動力: ${canvasTotals.cyan}`}></div>
                  <div className="lamp silver" onMouseEnter={() => setHoverStat(`防御力: ${canvasTotals.silver}`)} onMouseLeave={() => setHoverStat("")} title={`防御力: ${canvasTotals.silver}`}></div>
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
                  <span className="material-info">素材: {materials}</span>
                  <button className="toggle" onClick={handleResetData}>データ消去</button>
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
                  <div className="owned-selected-name">
                    <div className="owned-rarity">{ownedMeta?.rarity ? `レアリティ: ${ownedMeta.rarity}` : "レアリティ: 情報なし"}</div>
                    <div className="owned-title">{ownedTitle || ""}</div>
                  </div>
                  <div className="owned-selected-stats">
                    {(ownedStats || ownedMeta) ? (
                      <>
                        {ownedStats ? (
                          <div className="stat-row">
                            <div className="stat-led red"><span className="dot"></span><span>{STAT_LABELS.red}: {ownedStats.red}</span></div>
                            <div className="stat-led orange"><span className="dot"></span><span>{STAT_LABELS.orange}: {ownedStats.orange}</span></div>
                            <div className="stat-led green"><span className="dot"></span><span>{STAT_LABELS.green}: {ownedStats.green}</span></div>
                            <div className="stat-led cyan"><span className="dot"></span><span>{STAT_LABELS.cyan}: {ownedStats.cyan}</span></div>
                            <div className="stat-led silver"><span className="dot"></span><span>{STAT_LABELS.silver}: {ownedStats.silver}</span></div>
                          </div>
                        ) : null}
                        <div className="stat-meta">
                          {ownedMeta?.skill ? <span className="skill">滅ぼしスキル: {ownedMeta.skill.name}（{ownedMeta.skill.desc}）</span> : <span className="skill">滅ぼしスキル: 情報なし</span>}
                        </div>
                      </>
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

      
      {confirmExit && (
        <div className="confirm-overlay">
          <div className="confirm-panel">
            <div className="confirm-text">移動すると戦闘が終了します</div>
            <div className="confirm-buttons">
              <button className="toggle" onClick={() => { setConfirmExit(false); setPendingNav(null); }}>やめる</button>
              <button className="toggle" onClick={() => {
                setConfirmExit(false);
                if (pendingNav === "draw") handleDrawCore();
                else if (pendingNav === "assemble") handleAssembleCore();
                setPendingNav(null);
              }}>分かった</button>
            </div>
          </div>
        </div>
      )}

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


































