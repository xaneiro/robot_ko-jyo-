# coding: utf-8
from pathlib import Path
import re
path = Path('src/App.jsx')
text = path.read_text(encoding='utf-8')

# fix handleDragStart block with clean newlines
text, n1 = re.subn(
    r"const handleDragStart = \(item, e\) => \{.*?\};",
    "const handleDragStart = (item, e) => {\n    if (mode !== \"canvas\") return;\n    dragItemRef.current = item;\n    if (e && e.dataTransfer) {\n      e.dataTransfer.effectAllowed = \"copy\";\n      e.dataTransfer.dropEffect = \"copy\";\n      try { e.dataTransfer.setData(\"text/plain\", item.name); } catch (_) {}\n    }\n  };",
    text,
    flags=re.S,
)
if n1 == 0:
    raise SystemExit('handleDragStart not found')

pattern = r"  const ownedStack = ownedItems.map\(\(item, idx\) => \{\n.*?\n  \}\);\n"
new_block = "  const ownedStack = ownedItems.map((item, idx) => {\n    const jitterX = ((idx * 17) % 10) - 5;\n    const jitterY = ((idx * 13) % 12) - 6;\n    const baseLeft = 30 + idx * 64 + jitterX;\n    const top = 120 + jitterY;\n    const diff = hoveredIdx >= 0 ? idx - hoveredIdx : 0;\n    const offset = hoveredIdx >= 0 ? diff * 40 : 0;\n    const lift = diff === 0 && hoveredIdx >= 0 ? 40 : 0;\n    const baseRot = ((idx * 9) % 8) - 4;\n    const rot = hoveredIdx >= 0 ? (diff === 0 ? 0 : baseRot) : baseRot;\n    const scale = hoveredIdx >= 0 ? (diff === 0 ? 1.02 : 0.94) : 1;\n    const z = hoveredIdx >= 0 ? (diff === 0 ? 999 : 900 - Math.abs(diff)) : idx;\n    return (\n      <div\n        key={item.name}\n        className=\"stack-card\"\n        style={{ left: baseLeft + offset, top: top - lift, zIndex: z, transform: `rotate(${rot}deg) scale(${scale})`, cursor: mode === \"canvas\" ? \"grab\" : \"default\" }}\n        data-name={item.name}\n        draggable={mode === \"canvas\"}\n        onDragStart={(e) => handleDragStart(item, e)}\n        onDragEnd={handleDragEnd}\n        onMouseEnter={() => setOwnedHover(item.name)}\n        onMouseLeave={(e) => {\n          const next = e.relatedTarget;\n          if (!next || !next.closest || !next.closest(\".stack-card\")) setOwnedHover(null);\n        }}\n      >\n        <img src={item.img} alt={item.name} draggable={false} />\n        <div className=\"count-badge\" style={{ right: 8, bottom: 8 }}>\n          x{countsMap[item.name]}\n        </div>\n      </div>\n    );\n  });\n"
text, n2 = re.subn(pattern, new_block, text, flags=re.S)
if n2 == 0:
    raise SystemExit('ownedStack block not found')

text = text.replace('<div className="canvas-blank" ref={canvasRef}>', '<div className="canvas-blank" ref={canvasRef} onDragOver={handleCanvasDragOver} onDrop={handleCanvasDrop}>')

path.write_text(text, encoding='utf-8')
print('patched')
