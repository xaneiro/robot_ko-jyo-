# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/styles.css')
css=p.read_text(encoding='utf-8')
old=".battle-hand .hand-list { display:flex; gap:10px; max-width:520px; overflow-x:hidden; overflow-y:hidden; justify-content:flex-start; padding-bottom:4px; }"
new=".battle-hand .hand-list { display:flex; gap:6px; max-width:900px; overflow-x:hidden; overflow-y:hidden; justify-content:flex-start; padding-bottom:4px; }"
css=css.replace(old,new,1)
old2=".battle-hand .hand-card { position:relative; width:100px; min-height:140px; background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:6px 8px; color:#eaf6ff; font-size:12px; box-shadow: 0 6px 12px rgba(0,0,0,.25); transform: rotate(0deg); transition: transform .12s ease, box-shadow .12s ease; flex-shrink:0; }"
new2=".battle-hand .hand-card { position:relative; width:90px; min-height:140px; background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:6px 8px; color:#eaf6ff; font-size:12px; box-shadow: 0 6px 12px rgba(0,0,0,.25); transform: rotate(0deg); transition: transform .12s ease, box-shadow .12s ease; flex-shrink:0; }"
css=css.replace(old2,new2,1)
p.write_text(css,encoding='utf-8')
