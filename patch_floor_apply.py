from pathlib import Path
import re
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
# update skill kill block drop/floor
skill_block_old = """if (next <= 0) {\n        setMaterials((m) => m + 100);\n        clearBattleTimers();\n        setEnemyPlaced(false);\n        setEnemyDying(true);\n        setTimeout(() => {\n          spawnEnemy();\n        }, 800);\n      }"""
skill_block_new = """if (next <= 0) {\n        const multInfo = currentEnemy ? calcEnemyStats(currentEnemy, floor).mult : 1;\n        const drop = Math.max(1, Math.round(100 * multInfo));\n        setMaterials((m) => m + drop);\n        setFloor((f) => f + 1);\n        clearBattleTimers();\n        setEnemyPlaced(false);\n        setEnemyDying(true);\n        setTimeout(() => {\n          spawnEnemy();\n        }, 800);\n      }"""
text = text.replace(skill_block_old, skill_block_new, 1)
# ally tick kill block
ally_old = """if (next <= 0) {\n            setMaterials((m) => m + 100);\n            setFloor((f) => f + 1);\n            clearBattleTimers();\n            setEnemyPlaced(false);\n            setEnemyDying(true);\n            setTimeout(() => {\n              spawnEnemy();\n            }, 800);\n            return next;\n          }"""
ally_new = """if (next <= 0) {\n            const multInfo = currentEnemy ? calcEnemyStats(currentEnemy, floor).mult : 1;\n            const drop = Math.max(1, Math.round(100 * multInfo));\n            setMaterials((m) => m + drop);\n            setFloor((f) => f + 1);\n            clearBattleTimers();\n            setEnemyPlaced(false);\n            setEnemyDying(true);\n            setTimeout(() => {\n              spawnEnemy();\n            }, 800);\n            return next;\n          }"""
text = text.replace(ally_old, ally_new, 1)
# floor label insert near enemy hp text
text = text.replace('{enemyHP} / {enemyMaxHP}</div>\n                {enemyHitPulse ? <div className="enemy-dmg">-{enemyLastDmg}</div> : null}', '{enemyHP} / {enemyMaxHP}</div><div className="floor-label">{floor}F</div>\n                {enemyHitPulse ? <div className="enemy-dmg">-{enemyLastDmg}</div> : null}')
# ensure loadEnemies on mount
if 'loadEnemies();' not in text:
    text = text.replace('useEffect(() => {\n    localStorage.removeItem(LS_DRAWN);', 'useEffect(() => {\n    loadEnemies();\n    localStorage.removeItem(LS_DRAWN);')
p.write_text(text, encoding='utf-8')
print('applied floor/drop updates')
