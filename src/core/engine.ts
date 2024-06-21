import PdfTeXEngine from "../../LaTeX.wasm/XeTeXEngine";
import DvipdfmxEngine from "../../LaTeX.wasm/DvipdfmxEngine";

interface EngineType { 
    loadEngine: () => Promise<void>,
    writeMemFSFile: (file_name: string, content: string | Uint8Array) => void,
    compileLaTeX: () => Promise<{
        log: string,
        pdf: Uint8Array,
        status: number,
    }>,
    setEngineMainFile: (file_name: string) => void,
}

const engine: EngineType = new PdfTeXEngine();

export default engine;

export const Engine = () => {
    const engine: EngineType = new PdfTeXEngine();
    const engine2: any = new DvipdfmxEngine();

    const compile = async (content: string, log_callback = (log: string): void => {}): Promise<string | undefined> => {
        engine.writeMemFSFile("main.tex", content);
        engine.setEngineMainFile("main.tex");
        const r = await engine.compileLaTeX();

        log_callback(r.log);

        if (r.status === 0) {
            engine2.writeMemFSFile("main.xdv", r.pdf);
            engine2.setEngineMainFile("main.xdv");
            const r2 = await engine2.compilePDF();

            log_callback(r2.log);
            
            const pdfblob = new Blob([r2.pdf], {type : "application/pdf"});
            const objectURL = URL.createObjectURL(pdfblob);
            setTimeout(()=>{
                URL.revokeObjectURL(objectURL);
            }, 30000);

            return objectURL;
        }
    };

    const load = async () => {
        await engine.loadEngine();
        await engine2.loadEngine();
    };

    return {compile, load};
};

export const Uint8Array2PDF = (data: Uint8Array): string => {
    const blob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    return url;
};