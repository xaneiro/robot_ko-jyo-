from pathlib import Path
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
text = text.replace('<div className={`battle-enemy ${enemyDying ? "dying" : ""}`}>\n            <img src="/enemy/人類.png" alt="人類" />', '<div className={`battle-enemy ${enemyDying ? "dying" : ""}`}>\n            <img src={currentEnemy?.img || "/enemy/人類.png"} alt={currentEnemy?.key || "敵"} />')
p.write_text(text, encoding='utf-8')
print('enemy image now uses currentEnemy')
