from pathlib import Path
import re
p = Path('src/App.jsx')
text = p.read_text(encoding='utf-8')
# add game over state and confirm exit state
text = text.replace('const [mode, setMode] = useState("normal");', 'const [mode, setMode] = useState("normal");\n  const [gameOver, setGameOver] = useState({ visible: false, floor: 1 });\n  const [confirmExit, setConfirmExit] = useState(false);\n  const [pendingNav, setPendingNav] = useState(null);')
# gameOver reset when leaving battle
text = text.replace('setEnemyPlaced(false);\n      setEnemyDying(false);\n      setEnemyHP(100);', 'setEnemyPlaced(false);\n      setEnemyDying(false);\n      setEnemyHP(100);\n      setGameOver({ visible: false, floor: 1 });\n      setPendingNav(null);\n      setConfirmExit(false);')
# gameOver handler function
if 'function triggerGameOver' not in text:
    go_fn = """
  function triggerGameOver() {
    setGameOver({ visible: true, floor });
    clearBattleTimers();
  }
"""
    text = text.replace('const loadEnemies = () => {', go_fn + '\nconst loadEnemies = () => {', 1)
# ally HP drop to zero -> trigger game over
text = text.replace('if (hp <= 0) {\n          gameOver();\n          return 0;\n        }', 'if (hp <= 0) {\n          triggerGameOver();\n          return 0;\n        }')
# gameOver function removal if exists
text = text.replace('const gameOver = () => {\n    clearBattleTimers();\n    setMode("normal");\n    setEnemyPlaced(false);\n  };\n', '')
# warn dialog on navigation from battle for draw/assemble
nav_block = """  const handleNavWithConfirm = (target) => {
    if (mode === "battle" && enemyPlaced) {
      setConfirmExit(true);
      setPendingNav(target);
      return;
    }
    if (target === "draw") handleDrawCore();
    else if (target === "assemble") handleAssembleCore();
  };
"""
if 'handleNavWithConfirm' not in text:
    text = text.replace('const handleAssemble = () => {', nav_block + '\nconst handleAssemble = () => {', 1)
# refactor handleDraw/Assemble core
text = text.replace('const handleDraw = () => {', 'const handleDrawCore = () => {')
text = text.replace('const handleAssemble = () => {', 'const handleAssembleCore = () => {')
text = text.replace('const handleBattle = () => {', 'const handleBattle = () => {')
# add wrapper handleDraw/Assemble to use confirm logic
wrap = """
  const handleDraw = () => handleNavWithConfirm("draw");
  const handleAssemble = () => handleNavWithConfirm("assemble");
"""
if 'handleDraw = () => handleNavWithConfirm' not in text:
    text = text.replace('const handleBattle = () => {', wrap + '\nconst handleBattle = () => {', 1)
# game over overlay JSX
overlay_jsx = """
      {gameOver.visible && (
        <div className="gameover-overlay" onClick={() => {
          setGameOver({ visible: false, floor: 1 });
          setMode("normal");
          setEnemyPlaced(false);
          setEnemyDying(false);
          setEnemyHP(100);
          setEnemyMaxHP(100);
          setAllyHP(0);
          setAllyMaxHP(0);
          setHumanGauge(0);
          setHumanPoints(0);
          setHandCards([]);
        }}>
          <div className="gameover-panel">
            <div className="gameover-title">GAME OVER</div>
            <div className="gameover-floor">到達FLOOR: {gameOver.floor}F</div>
            <div className="gameover-hint">画面をクリックで戻る</div>
          </div>
        </div>
      )}
"""
text = text.replace('{modalImg && (', overlay_jsx + '\n      {modalImg && (', 1)
# confirm dialog JSX
confirm_jsx = """
      {confirmExit && (
        <div className="confirm-overlay">
          <div className="confirm-panel">
            <div className="confirm-text">移動すると戦闘が終了します</div>
            <div className="confirm-buttons">
              <button className="toggle" onClick={() => { setConfirmExit(false); setPendingNav(null); }}>やめる</button>
              <button className="toggle" onClick={() => {
                setConfirmExit(false);
                if (pendingNav === "draw") handleDrawCore();
                else if (pendingNav === "assemble") handleAssembleCore();
                setPendingNav(null);
              }}>分かった</button>
            </div>
          </div>
        </div>
      )}
"""
text = text.replace('{modalImg && (', confirm_jsx + '\n      {modalImg && (', 1)
# import.meta.glob warning: leave as is (vite warns but works)
p.write_text(text, encoding='utf-8')
print('patched gameover and confirm nav')
