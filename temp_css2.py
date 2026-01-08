# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/styles.css')
css=p.read_text(encoding='utf-8')
old='.enemy-hp.hud.hud-top-out { position:absolute; top:48px; right:12px; z-index: 8; }'
new='.enemy-hp.hud.hud-top-out { position:absolute; top:78px; right:12px; z-index: 8; }'
if old not in css:
    raise SystemExit('old not found')
p.write_text(css.replace(old,new,1), encoding='utf-8')
