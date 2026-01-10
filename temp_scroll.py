# -*- coding: utf-8 -*-
from pathlib import Path
p=Path('src/styles.css')
css=p.read_text(encoding='utf-8')
css=css.replace('overflow-x:auto;','overflow-x:hidden;')
css=css.replace('overflow:visible;','overflow:hidden;')
p.write_text(css,encoding='utf-8')
