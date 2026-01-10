from pathlib import Path
import re
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
# kill blocks replace to toggle enemyPlaced false then spawn after 800ms
skill_old = """if (next <= 0) {\n        setMaterials((m) => m + 100);\n        clearBattleTimers();\n        setEnemyDying(true);\n        setTimeout(() => {\n          spawnEnemy();\n        }, 800);\n      }"""
skill_new = """if (next <= 0) {\n        setMaterials((m) => m + 100);\n        clearBattleTimers();\n        setEnemyPlaced(false);\n        setEnemyDying(true);\n        setTimeout(() => {\n          spawnEnemy();\n        }, 800);\n      }"""
text = text.replace(skill_old, skill_new)
ally_pattern = r"if \(next <= 0\) {\n            setMaterials\(\(m\) => m \+ 100\);\n            clearBattleTimers\(\);\n            setEnemyDying\(true\);\n            setTimeout\(\(\) => {\n              spawnEnemy\(\);\n            }, 800\);\n            return next;\n          }"
ally_repl = "if (next <= 0) {\n            setMaterials((m) => m + 100);\n            clearBattleTimers();\n            setEnemyPlaced(false);\n            setEnemyDying(true);\n            setTimeout(() => {\n              spawnEnemy();\n            }, 800);\n            return next;\n          }"
text = re.sub(ally_pattern, ally_repl, text)
# battle start button condition to hide when enemyDying
text = text.replace('!enemyPlaced && (', '!enemyPlaced && !enemyDying && (')
p.write_text(text, encoding='utf-8')
print('patched')
