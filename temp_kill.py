# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/App.jsx')
text=p.read_text(encoding='utf-8')
old='''            setMaterials((m) => m + 100);
            clearBattleTimers();
            setEnemyPlaced(false);
            spawnEnemy();
            return next;
'''
new='''            setMaterials((m) => m + 100);
            clearBattleTimers();
            setEnemyPlaced(false);
            setTimeout(() => spawnEnemy(), 0);
            return next;
'''
if old not in text:
    raise SystemExit('kill block not found')
text=text.replace(old,new,1)
Path('src/App.jsx').write_text(text,encoding='utf-8')
