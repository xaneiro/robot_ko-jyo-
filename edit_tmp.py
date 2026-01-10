from pathlib import Path
p = Path('c:/Users/xanei/Desktop/サイト/ロボットコージョー/src/App.jsx')
text = p.read_text(encoding='utf-8')
extra = '\n    playSound("se6", 0.7);\n    setMode("battle");\n    setEnemyPlaced(false);\n    setPreviewPos(null);\n    setPreviewItem(null);\n    setSelectedId(null);\n    setIsDragging(false);\n    resizingRef.current = false;\n    resizeStartRef.current = null;\n    setResult({ type: "battle" });\n  };\n\n'
if extra in text:
    text = text.replace(extra, '\n', 1)
p.write_text(text, encoding='utf-8')
print('cleaned duplicate battle block')
