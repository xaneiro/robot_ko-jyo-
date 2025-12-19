import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

const FILES = ["Wide Adachi Walking.png","YO! SAY夏が胸を刺激する足立.png","────という事なんですが…….png","「今日は一日雨ですね」.png","『とりま聞こう？』.png","あ…あの奇天烈な動き…！.png","ああいあうあえあおあんいいういえいおいんううえうおうんええおえんおおんん.wav.png","あいたたた….png","あなた.png","あらららら….png","あれれ.png","あれれれ….png","あれ？さっきまでここに…どこ行った？.png","いくぞ～.png","うわっ！.png","うんちつんつん足立.png","こっちの方がいいかな.png","これかぁ～？.png","これか？.png","これもいいなぁ.png","さし.png","しゃがみ.png","そいやっそいやっ.png","そこそこ遠…トホホ.png","そこどこ？.png","どっせいどっせい.png","ぬき.png","ばいばーい足立.png","ふーん…ワクワク….png","ぽっぴぽっぴぽっぽっぴっぽー右足立.png","ぽっぴぽっぴぽっぽっぴっぽー左足立.png","わたしにも血液はあります.png","アン＝ダン＝チ＝レイ.png","イェーイ足立.png","サボテンダー足立.png","スパイダーレイ.png","スピニングバードキック！.png","スンッ….png","セクシー足立.png","ニコーー.png","バッター足立.png","パーティションはないない足立.png","フィラメント残量切れで途中までしか出力されなかった個体.png","ホッ！ハッ！ヤッ！.png","メカニカルガール足立.png","モデルさん足立.png","ヨガフロート足立.png","ライトニング・ボルト足立.png","ロケット足立.png","ワクワク.png","充電中足立.png","別に食べれないことないけどさ.png","君の幸運を祈る.png","固定ミスでずれて出力された個体.png","変わった人間もいるんですね.png","外出た瞬間終わった足立.png","岐阜の足立.png","幕引きだ！.png","引きこもり絶対ジャスティス足立.png","待ち足立.png","日進月歩遭難中.png","朝まで寝よーーーーーーーーっと！！.png","歌う足立.png","波動拳！.png","畳み掛ける！.png","目新しい音探して三千里.png","空N足立.png","立ち強p足立.png","管理・処理室.png","素材テストで出力された個体.png","美味しくなーれ！.png","荒ぶる鷹の足立.png","走り足立1.png","走り足立2.png","走り足立3.png","走り足立4.png","足(右).png","足(左).png","足立はダンスにハマってる？.png","首狩り族右足立.png","首狩り族左足立.png","鳴り止まないこの音楽を…….png","ﾚｲﾀﾞﾖｰ.png"];
const ITEMS = FILES.map((file) => ({ name: file.replace(/\.png$/i, ""), img: `/images/${file}` }));

const LS_DRAWN = "gacha_drawn_map_v1";
const LS_COUNT = "gacha_count_v3";
const LS_COUNTS = "gacha_card_counts_v1";

const randItem = () => ITEMS[Math.floor(Math.random() * ITEMS.length)];

const Badge = ({ got }) => (
  <span className={`badge ${got ? "got" : "locked"}`}>{got ? "入手済" : "未入手"}</span>
);

export default function App() {
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

  const dexBodyRef = useRef(null);
  const historyRef = useRef(null);
  const ownedRef = useRef(null);

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
    localStorage.setItem(LS_DRAWN, JSON.stringify(drawnMap));
    localStorage.setItem(LS_COUNTS, JSON.stringify(countsMap));
    localStorage.setItem(LS_COUNT, String(drawCount));
  }, [drawnMap, countsMap, drawCount]);

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

  const scrollToHistory = (name) => {
    const body = dexBodyRef.current;
    const list = historyRef.current;
    if (!body || !list) return;
    const card = list.querySelector(`[data-name="${name}"]`);
    if (!card) return;
    const top = card.offsetTop - 8;
    body.scrollTo({ top, behavior: "smooth" });
  };

  const handleDraw = () => {
    setMode("normal");
    playSound("se6", 0.8);
    const item = randItem();
    const now = Date.now();
    setDrawnMap((prev) => ({ ...prev, [item.name]: prev[item.name] || now }));
    setCountsMap((prev) => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }));
    setDrawCount((c) => c + 1);
    setResult({ type: "item", item, at: now, count: drawCount + 1 });
    setLastDrawnName(item.name);
    setDrawPulse((p) => p + 1);
  };

  const handleAssemble = () => {
    playSound("se6", 0.6);
    setMode("canvas");
    setResult({ type: "canvas" });
  };

  const ownedItems = useMemo(() => ITEMS.filter((i) => countsMap[i.name]), [countsMap]);
  const hoveredIdx = ownedItems.findIndex((i) => i.name === ownedHover);

  const historyList = ITEMS.map((item) => {
    const got = Boolean(drawnMap[item.name]);
    const displayName = got ? item.name : "???";
    return (
      <div
        key={item.name}
        className={`card ${got ? "got" : "locked"} history-card ${shakeName === item.name ? "shake" : ""}`}
        data-name={got ? item.name : undefined}
        onMouseEnter={() => playSound(got ? "se1" : "se2", 0.45)}
        onClick={() => {
          if (got) {
            playSound("se4", 0.65);
            setModalImg(item.img);
          } else {
            playSound("se5", 0.75);
            setShakeName(null);
            setTimeout(() => setShakeName(item.name), 0);
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
          <div className="count-badge">所持数: {countsMap[item.name] || 0}</div>
        </div>
      </div>
    );
  });

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
        key={item.name}
        className="stack-card"
        style={{ left: baseLeft + offset, top: top - lift, zIndex: z, transform: `rotate(${rot}deg) scale(${scale})` }}
        data-name={item.name}
        onMouseEnter={() => setOwnedHover(item.name)}
        onMouseLeave={(e) => {
          const next = e.relatedTarget;
          if (!next || !next.closest || !next.closest(".stack-card")) setOwnedHover(null);
        }}
      >
        <img src={item.img} alt={item.name} />
        <div className="count-badge" style={{ right: 8, bottom: 8 }}>
          x{countsMap[item.name]}
        </div>
      </div>
    );
  });

  const resultNode = (() => {
    if (result.type === "canvas") return <div className="canvas-blank">キャンバス</div>;
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
      const body = dexBodyRef.current;
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
            </div>

            <div className="monitor-screen">
              <div className="monitor-bezel">
                <div className="screen-inner">
                  {mode === "normal" && <div className="screen-noise"></div>}
                  <div className="result" id="result">
                    {resultNode}
                  </div>
                </div>
                <div className="console">
                  <div className="lamp red"></div>
                  <div className="lamp amber"></div>
                  <div className="lamp green"></div>
                  <div className="lamp blue"></div>
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
              <div className={`dex-body ${activeTab === "owned" ? "owned-no-scroll" : ""}`} ref={dexBodyRef} onWheel={handleDexWheel}>
                <div className={`tab-panel ${activeTab === "catalog" ? "active" : ""}`} id="tab-catalog">
                  <div className="history"><div className="list" id="history" ref={historyRef}>{historyList}</div></div>
                </div>
                <div className={`tab-panel ${activeTab === "owned" ? "active" : ""}`} id="tab-owned" onWheelCapture={handleDexWheel}>
                  <div className="owned-stack" onWheelCapture={handleDexWheel}>
                    <div className="owned-title" id="ownedTitle">{ownedHover || ""}</div>
                    <div className="stack-area" id="ownedStack" ref={ownedRef} onMouseLeave={() => setOwnedHover(null)} onWheelCapture={handleDexWheel}>
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












