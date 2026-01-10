from pathlib import Path
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
old = '{enemyPlaced && ('
new = '{(mode === "battle") && (enemyPlaced || enemyDying) && ('
text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')
print('updated condition')
