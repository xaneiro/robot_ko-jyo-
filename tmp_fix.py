from pathlib import Path
path = Path('src/App.jsx')
text = path.read_text(encoding='utf-8')

old_refs = "  const dexBodyRef = useRef(null);\n  const historyRef = useRef(null);\n  const ownedRef = useRef(null);\n"
new_refs = old_refs + "  const canvasRef = useRef(null);\n  const dragItemRef = useRef(null);\n"
if old_refs not in text:
    raise SystemExit('refs not found')
text = text.replace(old_refs, new_refs, 1)

assemble_old = "  const handleAssemble = () => {\n    playSound(\"se6\", 0.6);\n    setMode(\"canvas\");\n    setResult({ type: \"canvas\" });\n  };\n"
assemble_new = "  const handleAssemble = () => {\n    playSound(\"se6\", 0.6);\n    setMode(\"canvas\");\n    setCanvasItems([]);\n    setResult({ type: \"canvas\" });\n  };\n"
if assemble_old in text:
    text = text.replace(assemble_old, assemble_new, 1)

old_add = "  const addToCanvas = (item) => {\n    if (mode !== \"canvas\") return;\n    setCanvasItems((prev) => [\n      ...prev,\n      {\n        id: ${Date.now()}-,\n        name: item.name,\n        img: item.img,\n        x: Math.random() * 60 + 10,\n        y: Math.random() * 60 + 10,\n      },\n    ]);\n  };\n\n"
new_add = "  const addToCanvas = (item, xPerc, yPerc) => {\n    if (mode !== \"canvas\") return;\n    const clamp = (v) => Math.min(96, Math.max(4, v));\n    const x = xPerc == null ? Math.random() * 60 + 10 : clamp(xPerc);\n    const y = yPerc == null ? Math.random() * 60 + 10 : clamp(yPerc);\n    setCanvasItems((prev) => [\n      ...prev,\n      {\n        id: ${Date.now()}-,\n        name: item.name,\n        img: item.img,\n        x,\n        y,\n      },\n    ]);\n  };\n\n  const handleDragStart = (item, e) => {\n    if (mode !== \"canvas\") return;\n    dragItemRef.current = item;\n    if (e and e.dataTransfer):\n      pass\n\n  };\n"
# rebuild with proper JS
new_add = "  const addToCanvas = (item, xPerc, yPerc) => {\n" \
          "    if (mode !== \"canvas\") return;\n" \
          "    const clamp = (v) => Math.min(96, Math.max(4, v));\n" \
          "    const x = xPerc == null ? Math.random() * 60 + 10 : clamp(xPerc);\n" \
          "    const y = yPerc == null ? Math.random() * 60 + 10 : clamp(yPerc);\n" \
          "    setCanvasItems((prev) => [\n" \
          "      ...prev,\n" \
          "      {\n" \
          "        id: ${Date.now()}-,\n" \
          "        name: item.name,\n" \
          "        img: item.img,\n" \
          "        x,\n" \
          "        y,\n" \
          "      },\n" \
          "    ]);\n" \
          "  };\n\n" \
          "  const handleDragStart = (item, e) => {\n" \
          "    if (mode !== \"canvas\") return;\n" \
          "    dragItemRef.current = item;\n" \
          "    if (e && e.dataTransfer) {\n" \
          "      e.dataTransfer.effectAllowed = \"copy\";\n" \
          "      try { e.dataTransfer.setData(\"text/plain\", item.name); } catch (_) {}\n" \
          "    }\n" \
          "  };\n\n" \
          "  const handleDragEnd = () => {\n" \
          "    dragItemRef.current = null;\n" \
          "  };\n\n" \
          "  const handleCanvasDragOver = (e) => {\n" \
          "    if (mode !== \"canvas\") return;\n" \
          "    e.preventDefault();\n" \
          "  };\n\n" \
          "  const handleCanvasDrop = (e) => {\n" \
          "    if (mode !== \"canvas\") return;\n" \
          "    const item = dragItemRef.current;\n" \
          "    if (!item) return;\n" \
          "    const board = canvasRef.current;\n" \
          "    if (!board) return;\n" \
          "    e.preventDefault();\n" \
          "    const rect = board.getBoundingClientRect();\n" \
          "    const x = ((e.clientX - rect.left) / rect.width) * 100;\n" \
          "    const y = ((e.clientY - rect.top) / rect.height) * 100;\n" \
          "    addToCanvas(item, x, y);\n" \
          "    dragItemRef.current = null;\n" \
          "  };\n\n"
if old_add in text:
    text = text.replace(old_add, new_add, 1)

old_stack = "      <div\n        key={item.name}\n        className=\"stack-card\"\n        style={{ left: baseLeft + offset, top: top - lift, zIndex: z, transform: otate(deg) scale(), cursor: mode === \"canvas\" ? \"pointer\" : \"default\" }}\n        data-name={item.name}\n        draggable={mode === \"canvas\"}\n        onDragStart={(e) => handleDragStart(item, e)}\n        onDragEnd={handleDragEnd}\n        onMouseEnter={() => setOwnedHover(item.name)}\n        onMouseLeave={(e) => {\n          const next = e.relatedTarget;\n          if (!next || !next.closest || !next.closest(\".stack-card\")) setOwnedHover(null);\n        }}\n      >\n        <img src={item.img} alt={item.name} />\n"
if old_stack in text:
    new_stack = old_stack.replace('pointer', 'grab').replace('\n        draggable', '\n        draggable').replace('\n      >', '\n        onClick={() => {}}\n      >')
    text = text.replace(old_stack, new_stack, 1)
else:
    # fallback simpler replace of style block
    pass

old_board = '<div className="canvas-board">'
new_board = '<div className="canvas-board" onDragOver={handleCanvasDragOver} onDrop={handleCanvasDrop}>'
if old_board in text:
    text = text.replace(old_board, new_board, 1)

path.write_text(text, encoding='utf-8')
print('ok')
