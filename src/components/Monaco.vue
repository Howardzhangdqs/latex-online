<template>
    <div ref="codeEditBox" class="codeEditBox"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { editorProps } from "./MonacoType";
import * as monaco from "monaco-editor";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

self.MonacoEnvironment = {
    getWorker(_: string, label: string) {

        if (label === "json") {
            return new JsonWorker();
        }
        if (["typescript", "javascript"].includes(label)) {
            return new TsWorker();
        }
        return new EditorWorker();
    },
};

const defaultConfig = {
    minimap: { // 关闭代码缩略图
        enabled: false // 是否启用预览图
    },
    scrollBeyondLastLine: false,
};


export default defineComponent({
    name: "MonacoEditor",
    props: editorProps,
    emits: ["update:modelValue", "change", "editor-mounted"],
    setup(props, { emit }) {
        let editor: monaco.editor.IStandaloneCodeEditor;
        const codeEditBox = ref();

        const init = () => {
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: false
            });
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ES2020,
                allowNonTsExtensions: true
            });

            editor = monaco.editor.create(codeEditBox.value, {
                value: props.modelValue,
                language: props.language,
                theme: props.theme,
                ...props.options
            });

            // 监听值的变化
            editor.onDidChangeModelContent(() => {
                const value = editor.getValue();
                codeEditBox.value.style.maxHeight = ((value.split("\n").length + 1) * 22) + "px";
                emit("update:modelValue", value);
                emit("change", value);

            });

            emit("editor-mounted", editor);
        };

        watch(
            () => props.modelValue,
            newValue => {
                if (editor) {
                    const value = editor.getValue();
                    if (newValue !== value) {
                        editor.setValue(newValue);
                    }
                }
            }
        );

        watch(
            () => props.options,
            newValue => {
                editor.updateOptions({
                    ...defaultConfig,
                    ...newValue,
                });
            },
            { deep: true }
        );

        watch(
            () => props.language,
            newValue => {
                monaco.editor.setModelLanguage(editor.getModel()!, newValue);
            }
        );

        // if (props.height == "100%") {

        const autoHeight = () => {
            codeEditBox.value.style.maxHeight = ((props.modelValue.split("\n").length + 1) * 22) + "px";
        };

        onMounted(autoHeight);

        //     watch(() => props.modelValue, autoHeight);
        // }

        onBeforeUnmount(() => {
            editor.dispose();
        });

        onMounted(() => {
            init();
        });

        return { codeEditBox };
    }
});
</script>

<style scoped>
.codeEditBox {
    width: 100%;
    height: 100%;
    text-align: left;
}
</style>