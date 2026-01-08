# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/App.jsx')
text=p.read_text(encoding='utf-8')
needle="""            </div>
          </div>
        {!enemyPlaced && (
"""
insert="""            </div>
            <div className=\"battle-hand\">
              <button className=\"toggle\" onClick={handleHoloDraw} disabled={humanPoints < 1}>滅ぼしドロー ({Math.max(0, humanPoints)})</button>
              <div className=\"hand-list\">
                {handCards.length === 0 ? (
                  <div className=\"hand-empty\">手札なし</div>
                ) : (
                  handCards.map((h, idx) => (
                    <div className=\"hand-card\" key={`hand-${idx}`}>
                      <div className=\"hand-name\">{h.name}</div>
                      <div className=\"hand-skill\">{h.skill?.name || "情報なし"}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        {!enemyPlaced && (
"""
if needle not in text:
    raise SystemExit('needle not found')
text=text.replace(needle, insert,1)
p.write_text(text,encoding='utf-8')
