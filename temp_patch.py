# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/App.jsx')
text=p.read_text(encoding='utf-8')
marker = """  const handleBattle = () => {\n    playSound(\"se6\", 0.7);\n    setMode(\"battle\");\n    setEnemyPlaced(false);\n    setPreviewPos(null);\n    setPreviewItem(null);\n    setSelectedId(null);\n    setIsDragging(false);\n    resizingRef.current = false;\n    resizeStartRef.current = null;\n    setResult({ type: \"battle\" });\n  };\n\n"""
if marker not in text:
    raise SystemExit('marker not found')
insert = """  const handleHoloDraw = () => {\n    if (mode !== \"battle\") return;\n    if (humanPoints < 1) { playSound(\"se5\", 0.7); return; }\n    const withSkill = canvasItems\n      .map((c) => lookupItem(c.name))\n      .filter((m) => m and m.skill);\n    const pick = withSkill.length\n      ? withSkill[Math.floor(Math.random() * withSkill.length)]\n      : { name: \"情報なし\", skill: { name: \"情報なし\", desc: \"スキル未設定\" } };\n    setHumanPoints((p) => Math.max(0, p - 1));\n    setHandCards((prev) => {\n      const next = prev[:]\n      next.append({ 'name': pick['name'], 'skill': pick.get('skill') or { 'name': '情報なし', 'desc': 'スキル未設定' } })\n      if len(next) > 5:\n        next.pop(0)\n      return next\n    });\n  };\n\n"""
text=text.replace(marker, marker+insert)
p.write_text(text,encoding='utf-8')
