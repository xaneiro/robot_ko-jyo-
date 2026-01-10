# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/App.jsx')
text=p.read_text(encoding='utf-8')
old_handler='''  const handleSkillPlay = (card) => {
    const cost = card?.skill?.cost ?? 1;
    if (humanPoints < cost) { playSound("se5", 0.7); return; }
    setHumanPoints((p) => Math.max(0, p - cost));
    // TODO: スキル効果はここで適用する
  };
'''
new_handler='''  const handleSkillPlay = (card) => {
    const cost = card?.skill?.cost ?? 1;
    if (humanPoints < cost) { playSound("se5", 0.7); return; }
    setHumanPoints((p) => Math.max(0, p - cost));
    // スキル効果: キャンパス合計攻撃力の200%ダメージを敵へ
    const dmg = Math.max(0, canvasTotals.red * 2);
    playSound("se4", 0.7);
    setEnemyHP((hp) => {
      if (hp <= 0) return hp;
      const next = Math.max(0, hp - dmg);
      setEnemyLastDmg(dmg);
      setEnemyHitPulse((v) => v + 1);
      if (next <= 0) {
        setMaterials((m) => m + 100);
        clearBattleTimers();
        setEnemyPlaced(false);
        setTimeout(() => spawnEnemy(), 0);
      }
      return next;
    });
  };
'''
if old_handler not in text:
    raise SystemExit('handleSkillPlay block not found')
text=text.replace(old_handler,new_handler,1)
p.write_text(text,encoding='utf-8')
