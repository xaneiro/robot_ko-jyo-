from pathlib import Path
import re
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
text = text.replace('[enemyPlaced, setEnemyPlaced] = useState(false);', '[enemyPlaced, setEnemyPlaced] = useState(false);\n  const [enemyDying, setEnemyDying] = useState(false);')
text = text.replace('const spawnEnemy = () => {\n    setEnemyHP(100);', 'const spawnEnemy = () => {\n    setEnemyDying(false);\n    setEnemyHP(100);')
skill_old = """if (next <= 0) {\n        setMaterials((m) => m + 100);\n        clearBattleTimers();\n        setEnemyPlaced(false);\n        setTimeout(() => spawnEnemy(), 0);\n      }"""
skill_new = """if (next <= 0) {\n        setMaterials((m) => m + 100);\n        clearBattleTimers();\n        setEnemyDying(true);\n        setTimeout(() => {\n          spawnEnemy();\n        }, 800);\n      }"""
text = text.replace(skill_old, skill_new)
ally_pattern = r"if \(next <= 0\) {\n            setMaterials\(\(m\) => m \+ 100\);\n            clearBattleTimers\(\);\n            setEnemyPlaced\(false\);\n            setTimeout\(\(\) => spawnEnemy\(\), 0\);\n            return next;\n          }"
ally_repl = "if (next <= 0) {\n            setMaterials((m) => m + 100);\n            clearBattleTimers();\n            setEnemyDying(true);\n            setTimeout(() => {\n              spawnEnemy();\n            }, 800);\n            return next;\n          }"
text = re.sub(ally_pattern, ally_repl, text)
text = text.replace('setEnemyPlaced(false);\n      setEnemyHP(100);', 'setEnemyPlaced(false);\n      setEnemyDying(false);\n      setEnemyHP(100);')
text = text.replace('<div className="battle-enemy">', '<div className={`battle-enemy ${enemyDying ? "dying" : ""}`}>')
p.write_text(text, encoding='utf-8')
print('patched App.jsx')
