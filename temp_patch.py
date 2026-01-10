# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/App.jsx')
text=p.read_text(encoding='utf-8')
old_state = "  const [humanGauge, setHumanGauge] = useState(0);\n  const [humanPoints, setHumanPoints] = useState(0);\n  const [handCards, setHandCards] = useState([]);\n"
if old_state not in text:
    raise SystemExit('state block not found')
text=text.replace(old_state, old_state + "  const humanGaugeRef = useRef(0);\n")
marker = "  useEffect(() => { enemyHPRef.current = enemyHP; }, [enemyHP]);\n  useEffect(() => { allyHPRef.current = allyHP; }, [allyHP]);\n"
if marker not in text:
    raise SystemExit('ref effect not found')
insert = marker + "  useEffect(() => { humanGaugeRef.current = humanGauge; }, [humanGauge]);\n\n"
text=text.replace(marker, insert,1)
old_block = '''      if (canvasTotals.orange > 0) {
        setHumanGauge((g) => {
          let next = g + canvasTotals.orange;
          if (next >= 100) {
            next -= 100;
            setHumanPoints((p) => p + 1);
          }
          return next;
        });
      }
'''
new_block = '''      if (canvasTotals.orange > 0) {
        const total = humanGaugeRef.current + canvasTotals.orange;
        const pointsGain = Math.floor(total / 100);
        const nextGauge = total % 100;
        if (pointsGain) setHumanPoints((p) => p + 1);
        setHumanGauge(nextGauge);
        humanGaugeRef.current = nextGauge;
      }
'''
if old_block not in text:
    raise SystemExit('orange block not found')
text=text.replace(old_block,new_block,1)
text=text.replace('            setMaterials((m) => m + 100);\n            clearBattleTimers();\n            setEnemyPlaced(false);\n            setTimeout(() => spawnEnemy(), 1000);','            setMaterials((m) => m + 100);\n            clearBattleTimers();\n            setEnemyPlaced(false);\n            spawnEnemy();')
p.write_text(text,encoding='utf-8')
