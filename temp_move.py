# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/styles.css')
css=p.read_text(encoding='utf-8')
repl_hand = """
.battle-hand { position:absolute; right:12px; bottom:12px; background: rgba(0,0,0,0.45); padding:8px 10px; border-radius:10px; box-shadow: 0 6px 12px rgba(0,0,0,.25); display:flex; flex-direction:column; gap:6px; max-width:240px; z-index:9; }
.battle-hand .hand-list { display:flex; flex-direction:column; gap:4px; max-height:120px; overflow:auto; }
.battle-hand .hand-card { background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:6px; padding:4px 6px; color:#eaf6ff; font-size:12px; }
.battle-hand .hand-name { font-weight:700; }
.battle-hand .hand-skill { font-size:11px; color:#cfe4ff; }
.battle-hand .hand-empty { color:#cfe4ff; font-size:12px; }
"""
new_hand = """
.battle-hand { position:absolute; left:50%; bottom:12px; transform: translateX(-50%); background: rgba(0,0,0,0.45); padding:10px 12px; border-radius:10px; box-shadow: 0 6px 12px rgba(0,0,0,.25); display:flex; flex-direction:column; gap:8px; max-width:520px; z-index:9; align-items:center; }
.battle-hand .hand-list { display:flex; gap:10px; max-height:none; overflow:visible; justify-content:center; }
.battle-hand .hand-card { position:relative; width:110px; background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:6px 8px; color:#eaf6ff; font-size:12px; box-shadow: 0 6px 12px rgba(0,0,0,.25); transform: rotate(-4deg); transition: transform .12s ease, box-shadow .12s ease; }
.battle-hand .hand-card:not(:first-child) { margin-left:-36px; }
.battle-hand .hand-card:nth-child(2n) { transform: rotate(3deg); }
.battle-hand .hand-card:hover { transform: translateY(-10px) scale(1.03) rotate(0deg); box-shadow: 0 10px 16px rgba(0,0,0,.35); z-index:5; }
.battle-hand .hand-name { font-weight:700; margin-bottom:2px; }
.battle-hand .hand-skill { font-size:11px; color:#cfe4ff; }
.battle-hand .hand-empty { color:#cfe4ff; font-size:12px; }
"""
if repl_hand not in css:
    raise SystemExit('hand block not found')
css = css.replace(repl_hand,new_hand,1)
css = css.replace('.enemy-hp.hud.hud-top-out { position:absolute; top:8px; right:12px; z-index: 8; }', '.enemy-hp.hud.hud-top-out { position:absolute; top:48px; right:12px; z-index: 8; }')
Path('src/styles.css').write_text(css,encoding='utf-8')
