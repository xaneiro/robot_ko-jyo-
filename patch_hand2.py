from pathlib import Path
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
# unify battle-hand render condition to mode === "battle"
text = text.replace('{mode === "battle" && (', '{mode === "battle" && (')
text = text.replace('{mode === "battle" && (', '{mode === "battle" && (')
# replace the actual block condition if still using enemyPlaced
text = text.replace('{mode === "battle" && (enemyPlaced || enemyDying) && (', '{mode === "battle" && (')
# ensure hand list parent condition (div with className="battle-hand") is not inside another enemyPlaced-only block
# If there is a wrapping condition "{enemyPlaced && ( ... battle-hand ... )}" replace to "{mode === \"battle\" && ( ... )}"
text = text.replace('{enemyPlaced && (', '{mode === "battle" && (')
p.write_text(text, encoding='utf-8')
print('hand condition unified')
