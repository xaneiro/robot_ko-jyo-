from pathlib import Path
import re
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
ally_old = """          const dmg = canvasTotals.red;\n          const next = Math.max(0, hp - dmg);\n          setEnemyLastDmg(dmg);\n          setEnemyHitPulse((v) => v + 1);\n          if (next <= 0) {\n            setMaterials((m) => m + 100);\n            clearBattleTimers();\n            setEnemyPlaced(false);\n            setEnemyDying(true);\n            setTimeout(() => {\n              spawnEnemy();\n            }, 800);\n            return next;\n          }\n          return next;\n"""
ally_new = """          const dmg = canvasTotals.red;\n          const next = Math.max(0, hp - dmg);\n          setEnemyLastDmg(dmg);\n          setEnemyHitPulse((v) => v + 1);\n          if (next <= 0) {\n            handleEnemyDefeat();\n            return next;\n          }\n          return next;\n"""
text = text.replace(ally_old, ally_new, 1)
p.write_text(text, encoding='utf-8')
print('patched ally kill to handleEnemyDefeat')
