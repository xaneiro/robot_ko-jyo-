from pathlib import Path
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
text = text.replace('{(mode === "battle") && (enemyPlaced || enemyDying) && (', '{mode === "battle" && (')
p.write_text(text, encoding='utf-8')
print('relaxed hand visibility')
