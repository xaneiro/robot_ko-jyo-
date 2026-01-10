from pathlib import Path
from textwrap import dedent
p = Path('src/App.jsx')
s = p.read_text(encoding='utf-8')

block_old = dedent('''
    if (mode !== "battle") {
      clearBattleTimers();
      setInBattlePhase(false);
      setAllyProgress(0);
      setEnemyProgress(0);
      setEnemyPlaced(false);
      setEnemyDying(false);
      setEnemyHP(100);
      setGameOver({ visible: false, floor: 1 });
      setPendingNav(null);
      setConfirmExit(false);
      setEnemyMaxHP(100);
      setEnemyAtk(10);
      setEnemyAct(10);
      setHumanGauge(0);
      setHumanPoints(0);
      setHandCards([]);
      setAllyHP(0);
      setAllyMaxHP(0);
    }
  }, [mode]);
''')
block_new = dedent('''
    if (mode !== "battle") {
      clearBattleTimers();
      setInBattlePhase(false);
      setAllyProgress(0);
      setEnemyProgress(0);
      setEnemyPlaced(false);
      setEnemyDying(false);
      setEnemyHP(100);
      setGameOver({ visible: false, floor: 1 });
      setFloor(1);
      setPendingNav(null);
      setConfirmExit(false);
      setEnemyMaxHP(100);
      setEnemyAtk(10);
      setEnemyAct(10);
      setHumanGauge(0);
      setHumanPoints(0);
      setHandCards([]);
      setAllyHP(0);
      setAllyMaxHP(0);
    }
  }, [mode]);
''')
if block_old in s:
    s = s.replace(block_old, block_new, 1)
else:
    print('mode reset block not matched')

overlay_old = "setGameOver({ visible: false, floor: 1 });\n          setMode(\"normal\");\n          setEnemyPlaced(false);\n          setEnemyDying(false);\n          setEnemyHP(100);\n          setEnemyMaxHP(100);\n          setAllyHP(0);\n          setAllyMaxHP(0);\n          setHumanGauge(0);\n          setHumanPoints(0);\n          setHandCards([]);\n        }}\n>"
overlay_new = "setGameOver({ visible: false, floor: 1 });\n          setFloor(1);\n          setMode(\"normal\");\n          setEnemyPlaced(false);\n          setEnemyDying(false);\n          setEnemyHP(100);\n          setEnemyMaxHP(100);\n          setAllyHP(0);\n          setAllyMaxHP(0);\n          setHumanGauge(0);\n          setHumanPoints(0);\n          setHandCards([]);\n        }}\n>"
if overlay_old in s:
    s = s.replace(overlay_old, overlay_new, 1)
else:
    print('overlay block not matched')

p.write_text(s, encoding='utf-8')
