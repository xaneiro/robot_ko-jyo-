# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/App.jsx')
text=p.read_text(encoding='utf-8')
old='''      if (canvasTotals.orange > 0) {
        setHumanGauge((g) => {
          let next = g + canvasTotals.orange;
          let pointsGain = 0;
          while (next >= 100) {
            next -= 100;
            pointsGain += 1;
          }
          if (pointsGain) setHumanPoints((p) => p + pointsGain);
          return next;
        });
      }
'''
new='''      if (canvasTotals.orange > 0) {
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
if old not in text:
    raise SystemExit('orange block not found')
p.write_text(text.replace(old,new,1), encoding='utf-8')
