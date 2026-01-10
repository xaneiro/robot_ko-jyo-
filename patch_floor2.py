from pathlib import Path
import re
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
# defeat handler
if 'function handleEnemyDefeat' not in text:
    defeat_fn = """
  function handleEnemyDefeat() {
    const multInfo = currentEnemy ? calcEnemyStats(currentEnemy, floor).mult : 1;
    const drop = Math.max(1, Math.round(100 * multInfo));
    setMaterials((m) => m + drop);
    setFloor((f) => f + 1);
    clearBattleTimers();
    setEnemyPlaced(false);
    setEnemyDying(true);
    setTimeout(() => {
      spawnEnemy();
    }, 800);
  }
"""
    text = text.replace('const spawnEnemy = () => {', defeat_fn + '\nconst spawnEnemy = () => {', 1)
# skill kill -> defeat handler
skill_old = """if (next <= 0) {\n        const multInfo = currentEnemy ? calcEnemyStats(currentEnemy, floor).mult : 1;\n        const drop = Math.max(1, Math.round(100 * multInfo));\n        setMaterials((m) => m + drop);\n        setFloor((f) => f + 1);\n        clearBattleTimers();\n        setEnemyPlaced(false);\n        setEnemyDying(true);\n        setTimeout(() => {\n          spawnEnemy();\n        }, 800);\n      }"""
skill_new = """if (next <= 0) {\n        handleEnemyDefeat();\n      }"""
text = text.replace(skill_old, skill_new, 1)
# ally kill -> defeat handler
ally_old = """if (next <= 0) {\n            const multInfo = currentEnemy ? calcEnemyStats(currentEnemy, floor).mult : 1;\n            const drop = Math.max(1, Math.round(100 * multInfo));\n            setMaterials((m) => m + drop);\n            setFloor((f) => f + 1);\n            clearBattleTimers();\n            setEnemyPlaced(false);\n            setEnemyDying(true);\n            setTimeout(() => {\n              spawnEnemy();\n            }, 800);\n            return next;\n          }"""
ally_new = """if (next <= 0) {\n            handleEnemyDefeat();\n            return next;\n          }"""
text = text.replace(ally_old, ally_new, 1)
# enemy images glob
if 'const enemyImages' not in text:
    glob_block = "const enemyImages = import.meta.glob('/enemy/*.png', { eager: true, as: 'url' });\n"
    text = text.replace('const ITEMS = FILES.map', glob_block + 'const ITEMS = FILES.map', 1)
text = text.replace('const preset = ["人類.png"];\n    const roster = preset.map((name, idx) => {', 'const roster = Object.keys(enemyImages).map((path, idx) => {\n      const name = path.split("/").pop();')
text = text.replace('return { key: name, img: `/enemy/${name}`, baseHP, baseAtk, baseAct };', 'return { key: name, img: enemyImages[path] || `/enemy/${name}`, baseHP, baseAtk, baseAct };')
# floor label
text = text.replace('{enemyHP} / {enemyMaxHP}</div>\n                {enemyHitPulse ? <div className="enemy-dmg">-{enemyLastDmg}</div> : null}', '{enemyHP} / {enemyMaxHP}</div><div className="floor-label">{floor}F</div>\n                {enemyHitPulse ? <div className="enemy-dmg">-{enemyLastDmg}</div> : null}')
# loadEnemies on mount
if 'loadEnemies();' not in text:
    text = text.replace('useEffect(() => {\n    localStorage.removeItem(LS_DRAWN);', 'useEffect(() => {\n    loadEnemies();\n    localStorage.removeItem(LS_DRAWN);')
p.write_text(text, encoding='utf-8')
print('patched (defeat handler, enemy glob, floor label)')