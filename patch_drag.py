from pathlib import Path
path = Path('src/App.jsx')
text = path.read_text(encoding='utf-8')
old = "            <div className=\"monitor-screen\">\n              <div className=\"monitor-bezel\">\n                <div className={`screen-inner ${mode === \"canvas\" ? \"canvas-mode\" : \"\"}`}>"
new = "            <div className=\"monitor-screen\">\n              <div className=\"monitor-bezel\">\n                <div className={`screen-inner ${mode === \"canvas\" ? \"canvas-mode\" : \"\"}`} onDragOver={mode === \"canvas\" ? handleCanvasDragOver : undefined} onDrop={mode === \"canvas\" ? handleCanvasDrop : undefined}>"
if old not in text:
    raise SystemExit('block not found')
text = text.replace(old, new, 1)
old2 = "                  <div className={`result ${mode === \"canvas\" ? \"canvas-mode\" : \"\"}`} id=\"result\">"
new2 = "                  <div className={`result ${mode === \"canvas\" ? \"canvas-mode\" : \"\"}`} id=\"result\" onDragOver={mode === \"canvas\" ? handleCanvasDragOver : undefined} onDrop={mode === \"canvas\" ? handleCanvasDrop : undefined}>"
if old2 not in text:
    raise SystemExit('result block not found')
text = text.replace(old2, new2, 1)
path.write_text(text, encoding='utf-8')
print('patched drag targets')
