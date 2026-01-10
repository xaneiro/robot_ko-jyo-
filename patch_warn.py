from pathlib import Path
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
text = text.replace("function triggerGameOver() {\n    setGameOver({ visible: true, floor });\n    clearBattleTimers();\n  }", "function triggerGameOver() {\n    setGameOver({ visible: true, floor });\n    clearBattleTimers();\n    setEnemyPlaced(true);\n    setEnemyDying(false);\n    setEnemyHP(0);\n  }")
text = text.replace('if (mode === "battle" && enemyPlaced) {', 'if (mode === "battle") {')
p.write_text(text, encoding='utf-8')
print('patched game over & confirm condition')
