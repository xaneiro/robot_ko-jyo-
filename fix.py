# -*- coding: utf-8 -*-
from pathlib import Path
p = Path('src/App.jsx')
t = p.read_text(encoding='utf-8')
replacements = {
    'const handleDraw = () => \\n    setMode("normal");\\n    setEnemyPlaced(false);': 'const handleDraw = () => {\n    setMode("normal");\n    setEnemyPlaced(false);',
    'const handleAssemble = () => \\n    playSound("se6", 0.6);\\n    setMode("canvas");\\n    setEnemyPlaced(false);': 'const handleAssemble = () => {\n    playSound("se6", 0.6);\n    setMode("canvas");\n    setEnemyPlaced(false);',
    'const handleBattle = () => \\n    playSound("se6", 0.7);\\n    setMode("battle");\\n    setEnemyPlaced(false);': 'const handleBattle = () => {\n    playSound("se6", 0.7);\n    setMode("battle");\n    setEnemyPlaced(false);',
    '!enemyPlaced && (<button className="battle-start-btn" onClick={() => setEnemyPlaced(true)}>戦闘開始！</button>)}\\n        {enemyPlaced && (<div className="battle-enemy"><img src="/enemy/人類.png" alt="人類" /></div>)}\\n        </div>\\n      );': '!enemyPlaced && (\n          <button className="battle-start-btn" onClick={() => setEnemyPlaced(true)}>戦闘開始！</button>\n        )}\n        {enemyPlaced && (\n          <div className="battle-enemy">\n            <img src="/enemy/人類.png" alt="人類" />\n          </div>\n        )}\n        </div>\n      );'
}
for old, new in replacements.items():
    if old in t:
        t = t.replace(old, new)
p.write_text(t, encoding='utf-8')
