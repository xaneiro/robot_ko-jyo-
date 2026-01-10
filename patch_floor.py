from pathlib import Path
import re
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
# add states
text = text.replace('[enemyPlaced, setEnemyPlaced] = useState(false);', '[enemyPlaced, setEnemyPlaced] = useState(false);\n  const [floor, setFloor] = useState(1);\n  const [enemyRoster, setEnemyRoster] = useState([]);\n  const [currentEnemy, setCurrentEnemy] = useState(null);')
# helper functions
if 'const loadEnemies' not in text:
    helper = """
  const loadEnemies = () => {
    const preset = ["人類.png"];
    const roster = preset.map((name, idx) => {
      const baseHP = 80 + (idx * 13) % 50;
      const baseAtk = 8 + (idx * 7) % 10;
      const baseAct = 8 + (idx * 5) % 10;
      return { key: name, img: `/enemy/${name}`, baseHP, baseAtk, baseAct };
    });
    setEnemyRoster(roster);
    return roster;
  };

  const calcEnemyStats = (enemy, floorNum) => {
    const baseHP = enemy.baseHP;
    const baseAtk = enemy.baseAtk;
    const baseAct = enemy.baseAct;
    let mult = 1 + 0.12 * Math.max(0, floorNum - 1);
    if (floorNum % 10 === 0) mult *= 2.2; // ボス
    else if (floorNum % 5 === 0) mult *= 1.6; // 中ボス
    return {
      hp: Math.max(1, Math.round(baseHP * mult)),
      atk: Math.max(1, Math.round(baseAtk * mult)),
      act: Math.max(1, Math.round(baseAct * mult)),
      mult,
    };
  };
"""
    text = text.replace('const spawnEnemy = () => {', helper + '\nconst spawnEnemy = () => {', 1)
# rewrite spawnEnemy
spawn_pattern = r"const spawnEnemy = \(\) => \{\n    setEnemyDying\(false\);\n    setEnemyHP\(100\);\n    setEnemyMaxHP\(100\);\n    setEnemyAtk\(10\);\n    setEnemyAct\(10\);\n    setEnemyHitPulse\(0\);\n    setEnemyLastDmg\(0\);\n    setEnemyPlaced\(true\);\n  \};"
spawn_repl = "const spawnEnemy = () => {\n    setEnemyDying(false);\n    const roster = enemyRoster.length ? enemyRoster : loadEnemies();\n    const pick = roster[Math.floor(Math.random() * roster.length)];\n    const stats = calcEnemyStats(pick, floor);\n    setCurrentEnemy(pick);\n    setEnemyHP(stats.hp);\n    setEnemyMaxHP(stats.hp);\n    setEnemyAtk(stats.atk);\n    setEnemyAct(stats.act);\n    setEnemyHitPulse(0);\n    setEnemyLastDmg(0);\n    setEnemyPlaced(true);\n  };"
text = re.sub(spawn_pattern, spawn_repl, text)
# kill blocks
kill_old = """if (next <= 0) {\n        const drop = Math.max(1, Math.round(100 * (currentEnemy ? calcEnemyStats(currentEnemy, floor).mult : 1)));
        setMaterials((m) => m + drop);
        setFloor((f) => f + 1);
        clearBattleTimers();\n        setEnemyPlaced(false);\n        setEnemyDying(true);\n        setTimeout(() => {\n          spawnEnemy();\n        }, 800);\n      }"""
# ensure we replace both kill blocks with same snippet (they are already using drop/mult). Just in case base text different, we use regex fallback below
if kill_old in text:
    text = text.replace(kill_old, kill_old)
else:
    pass
# ally kill pattern
ally_pattern = r"if \(next <= 0\) {\n            const multInfo = currentEnemy \? calcEnemyStats\(currentEnemy, floor\).mult : 1;\n            const drop = Math.max\(1, Math.round\(100 \* multInfo\)\);\n            setMaterials\(\(m\) => m \+ drop\);\n            setFloor\(\(f\) => f \+ 1\);\n            clearBattleTimers\(\);\n            setEnemyPlaced\(false\);\n            setEnemyDying\(true\);\n            setTimeout\(\(\) => {\n              spawnEnemy\(\);\n            }, 800\);\n            return next;\n          }"
if not re.search(ally_pattern, text):
    # replace generic block with mult+drop
    text = text.replace('setMaterials((m) => m + 100);\n            setFloor((f) => f + 1);', 'const multInfo = currentEnemy ? calcEnemyStats(currentEnemy, floor).mult : 1;\n            const drop = Math.max(1, Math.round(100 * multInfo));\n            setMaterials((m) => m + drop);\n            setFloor((f) => f + 1);')
# floor label
text = text.replace(' {enemyHP} / {enemyMaxHP}</div><div className="floor-label">{floor}F</div>', ' {enemyHP} / {enemyMaxHP}</div><div className="floor-label">{floor}F</div>')
# init roster on mount if missing
if 'loadEnemies();' not in text:
    text = text.replace('useEffect(() => {\n    localStorage.removeItem(LS_DRAWN);', 'useEffect(() => {\n    loadEnemies();\n    localStorage.removeItem(LS_DRAWN);')
p.write_text(text, encoding='utf-8')
print('patched floor/roster (please verify placement manually)')
