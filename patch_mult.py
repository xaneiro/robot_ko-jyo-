from pathlib import Path
import re
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
# update calcEnemyStats multiplier
pattern = r"let mult = 1 \+ 0\.12 \* Math\.max\(0, floorNum - 1\);\n    if \(floorNum % 10 === 0\) mult \*= 2\.2; // ボス\n    else if \(floorNum % 5 === 0\) mult \*= 1\.6; // 中ボス"
repl = "let mult = 1 + 0.5 * Math.max(0, floorNum - 1);\n    if (floorNum % 10 === 0) mult *= 3.0; // ボス強化\n    else if (floorNum % 5 === 0) mult *= 2.0; // 中ボス強化"
text = re.sub(pattern, repl, text, count=1)
p.write_text(text, encoding='utf-8')
print('boosted floor multiplier')
