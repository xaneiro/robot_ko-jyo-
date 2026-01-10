# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/App.jsx')
text=p.read_text(encoding='utf-8')
# add cost to 00 skill
text=text.replace('    skill = { name: "人類滅ぼしパンチ", desc: "攻撃力依存、200%のダメージ" };','    skill = { name: "人類滅ぼしパンチ", desc: "攻撃力依存、200%のダメージ", cost: 1 };')
# ensure humanGaugeRef sync effect exists
if 'useEffect(() => { humanGaugeRef.current = humanGauge; }, [humanGauge]);' not in text:
    text=text.replace('  useEffect(() => { enemyHPRef.current = enemyHP; }, [enemyHP]);\n  useEffect(() => { allyHPRef.current = allyHP; }, [allyHP]);\n','  useEffect(() => { enemyHPRef.current = enemyHP; }, [enemyHP]);\n  useEffect(() => { allyHPRef.current = allyHP; }, [allyHP]);\n  useEffect(() => { humanGaugeRef.current = humanGauge; }, [humanGauge]);\n\n')
# replace orange gauge block to single-point add
old_orange='''      if (canvasTotals.orange > 0) {
        const total = humanGaugeRef.current + canvasTotals.orange;
        const pointsGain = Math.floor(total / 100);
        const nextGauge = total % 100;
        if (pointsGain) setHumanPoints((p) => p + 1);
        setHumanGauge(nextGauge);
        humanGaugeRef.current = nextGauge;
      }
'''
new_orange='''      if (canvasTotals.orange > 0) {
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
'''
if old_orange in text:
    text=text.replace(old_orange,new_orange,1)
# insert handleSkillPlay after handleBattle if not present
if 'const handleSkillPlay' not in text:
    marker='  const handleBattle = () => {\n'
    if marker in text:
        idx=text.index(marker)+len(marker)
        insert='''    // スキルカード発動処理\n  const handleSkillPlay = (card) => {\n    const cost = card?.skill?.cost ?? 1;\n    if (humanPoints < cost) { playSound("se5", 0.7); return; }\n    setHumanPoints((p) => Math.max(0, p - cost));\n    // TODO: スキル効果はここで適用する\n  };\n\n'''
        text=text[:idx]+insert+text[idx:]
# update handleHoloDraw: block when full, include default cost
old_draw='''  const handleHoloDraw = () => {
    if (mode !== "battle") return;
    if (humanPoints < 1) { playSound("se5", 0.7); return; }
    const withSkill = canvasItems
      .map((c) => lookupItem(c.name))
      .filter((m) => m && m.skill);
    const pick = withSkill.length
      ? withSkill[Math.floor(Math.random() * withSkill.length)]
      : { name: "情報なし", skill: { name: "情報なし", desc: "スキル未設定" } };
    setHumanPoints((p) => Math.max(0, p - 1));
    setHandCards((prev) => {
      const next = [...prev, { name: pick.name, skill: pick.skill || { name: "情報なし", desc: "スキル未設定" } }];
      if (next.length > 5) next.shift();
      return next;
    });
  };
'''
new_draw='''  const handleHoloDraw = () => {
    if (mode !== "battle") return;
    if (humanPoints < 1) { playSound("se5", 0.7); return; }
    if (handCards.length >= 5) { playSound("se5", 0.7); return; }
    const withSkill = canvasItems
      .map((c) => lookupItem(c.name))
      .filter((m) => m && m.skill);
    const pick = withSkill.length
      ? withSkill[Math.floor(Math.random() * withSkill.length)]
      : { name: "情報なし", skill: { name: "情報なし", desc: "スキル未設定", cost: 1 } };
    setHumanPoints((p) => Math.max(0, p - 1));
    setHandCards((prev) => {
      if (prev.length >= 5) return prev;
      return [...prev, { name: pick.name, skill: pick.skill || { name: "情報なし", desc: "スキル未設定", cost: 1 } }];
    });
  };
'''
if old_draw in text:
    text=text.replace(old_draw,new_draw,1)
# update hand render block to be clickable and show cost
old_render='''                  {handCards.length === 0 ? (
                    <div className="hand-empty">手札なし</div>
                  ) : (
                    handCards.map((h, idx) => (
                      <div className="hand-card" key={`hand-${idx}`}>
                        <div className="hand-name">{h.name}</div>
                        <div className="hand-skill">{h.skill?.name || "情報なし"}</div>
                      </div>
                    ))
                  )}
'''
new_render='''                  {handCards.length === 0 ? (
                    <div className="hand-empty">手札なし</div>
                  ) : (
                    handCards.map((h, idx) => (
                      <div className="hand-card" key={`hand-${idx}`} onClick={() => handleSkillPlay(h)}>
                        <div className="hand-name">{h.name}</div>
                        <div className="hand-skill">{h.skill?.name || "情報なし"}</div>
                        <div className="hand-cost">消費: {h.skill?.cost ?? 1}</div>
                      </div>
                    ))
                  )}
'''
if old_render in text:
    text=text.replace(old_render,new_render,1)
Path('src/App.jsx').write_text(text,encoding='utf-8')
