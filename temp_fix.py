# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/App.jsx')
text=p.read_text(encoding='utf-8')
old='''  const handleHoloDraw = () => {
    if (mode !== "battle") return;
    if (humanPoints < 1) { playSound("se5", 0.7); return; }
    const withSkill = canvasItems
      .map((c) => lookupItem(c.name))
      .filter((m) => m and m.skill);
    const pick = withSkill.length
      ? withSkill[Math.floor(Math.random() * withSkill.length)]
      : { name: "情報なし", skill: { name: "情報なし", desc: "スキル未設定" } };
    setHumanPoints((p) => Math.max(0, p - 1));
    setHandCards((prev) => {
      const next = prev[:]
      next.append({ 'name': pick['name'], 'skill': pick.get('skill') or { 'name': '情報なし', 'desc': 'スキル未設定' } })
      if len(next) > 5:
        next.pop(0)
      return next
    });
  };
'''
new='''  const handleHoloDraw = () => {
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
if old not in text:
    raise SystemExit('old block not found')
text=text.replace(old,new,1)
p.write_text(text,encoding='utf-8')
