from pathlib import Path
p = Path('c:/Users/xanei/Desktop/サイト/ロボットコージョー/src/styles.css')
text = p.read_text(encoding='utf-8')
text = text.replace('max-width:520px;', 'max-width:95%;')
text = text.replace('max-width:900px; overflow-x:hidden; overflow-y:hidden;', 'max-width:100%; overflow-x:auto; overflow-y:hidden; scrollbar-width: none;')
if 'hand-list::-webkit-scrollbar' not in text:
    text += '\n.battle-hand .hand-list::-webkit-scrollbar { display:none; }\n'
p.write_text(text, encoding='utf-8')
print('updated styles.css')
