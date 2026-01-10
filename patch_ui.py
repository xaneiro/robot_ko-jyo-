from pathlib import Path
import re
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
# triggerGameOver force mode battle and keep enemyPlaced true, stop timers
text = text.replace("function triggerGameOver() {\n    setGameOver({ visible: true, floor });\n    clearBattleTimers();\n    setEnemyPlaced(true);\n    setEnemyDying(false);\n    setEnemyHP(0);\n  }",
"function triggerGameOver() {\n    setGameOver({ visible: true, floor });\n    clearBattleTimers();\n    setMode(\"battle\");\n    setEnemyPlaced(true);\n    setEnemyDying(false);\n    setEnemyHP(0);\n  }")
# battle effect guard remove enemyPlaced check
text = text.replace('if (mode !== "battle" || !enemyPlaced) {\n      clearBattleTimers();\n      return;\n    }','if (mode !== "battle") {\n      clearBattleTimers();\n      return;\n    }')
p.write_text(text, encoding='utf-8')
print('patched gameover and effect guard')
