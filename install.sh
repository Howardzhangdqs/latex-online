# wget https://github.com/SwiftLaTeX/SwiftLaTeX/releases/download/v20022022/20-02-2022.zip
# unzip 20-02-2022.zip -d LaTeX.wasm


# echo "export default PdfTeXEngine;" >> ./LaTeX.wasm/PdfTeXEngine.js
echo "declare let PdfTeXEngine: any; export default PdfTeXEngine;" > ./LaTeX.wasm/PdfTeXEngine.d.ts
echo "declare let XeTeXEngine: any; export default XeTeXEngine;" > ./LaTeX.wasm/XeTeXEngine.d.ts
echo "declare let DvipdfmxEngine: any; export default DvipdfmxEngine;" > ./LaTeX.wasm/DvipdfmxEngine.d.ts

cp ./LaTeX.wasm/swiftlatex*tex.js ./public/
cp ./LaTeX.wasm/swiftlatex*tex.wasm ./public/