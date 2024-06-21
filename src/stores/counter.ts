import { ref } from "vue";

export const default_content = ref<string>(`%test.tex
\\documentclass{article}
\\usepackage{CJKutf8}
\\begin{document}
\\begin{CJK}{UTF8}{gbsn}
这是一个CJKutf8的例子，使用的字体是gbsn。
\\end{CJK}
\\end{document}
`);