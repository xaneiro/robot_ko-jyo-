from pathlib import Path
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
text = text.replace('{mode === "battle" && (', '{mode === "battle" && (enemyPlaced || enemyDying) && (')
p.write_text(text, encoding='utf-8')
print('hand condition set to battle & enemyPlaced||enemyDying')
