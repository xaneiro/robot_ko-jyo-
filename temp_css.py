# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/styles.css')
css='''
.battle-hand { position:absolute; right:12px; bottom:12px; background: rgba(0,0,0,0.45); padding:8px 10px; border-radius:10px; box-shadow: 0 6px 12px rgba(0,0,0,.25); display:flex; flex-direction:column; gap:6px; max-width:240px; z-index:9; }
.battle-hand .hand-list { display:flex; flex-direction:column; gap:4px; max-height:120px; overflow:auto; }
.battle-hand .hand-card { background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:6px; padding:4px 6px; color:#eaf6ff; font-size:12px; }
.battle-hand .hand-name { font-weight:700; }
.battle-hand .hand-skill { font-size:11px; color:#cfe4ff; }
.battle-hand .hand-empty { color:#cfe4ff; font-size:12px; }
'''
p.write_text(p.read_text(encoding='utf-8') + '\n' + css, encoding='utf-8')
