<script setup lang="ts">
import { Engine } from "@/core/engine";
import Monaco from "@/components/Monaco.vue";
import { onMounted, ref } from "vue";

import PdfView from "@/components/PdfView.vue";

import { default_content } from "@/stores/counter";

const content = ref<string>(default_content.value);

const pdfurl = ref("");

const engine = Engine();

onMounted(async () => {
    console.log("loading");
    await engine.load();
    console.log("loaded");
});

const timer = ref<number>(0);

const compiling = ref<boolean>(false);

const compiler_log = ref<string>("");

const compile = async () => {
    compiler_log.value = "";
    let start = +new Date();

    let interval = setInterval(() => {
        timer.value = +new Date() - start;
    }, 100);

    compiling.value = true;

    const log_callback = (log: string) => {
        if (compiler_log.value == "") compiler_log.value = log;
        else compiler_log.value += "\n" + log;
    };

    const url = await engine.compile(content.value, log_callback);

    compiling.value = false;

    timer.value = +new Date() - start;

    clearInterval(interval);

    console.log(url);

    pdfurl.value = url || "";
};

const update_content = (val: string) => {
    content.value = val;
    // console.log(val);
};


const show_log = ref<boolean>(false);
</script>

<template>
    <Splitter style="height: 100%">
        <SplitterPanel class="panel" :minSize="20">
            <div class="splitter-panel" style="display: flex; flex-direction: column">
                <Monaco v-model:modelValue="default_content" language="" @change="update_content" />
                <div>
                    <div style="margin: .5rem; display: flex; gap: .8rem; align-items: center;">
                        <Button :label="compiling ? 'Compiling' : 'Compile'" @click="compile" :disabled="compiling" />
                        <div>{{ (timer / 1000).toFixed(1) }}s</div>
                        <Button label="log" @click="show_log = true"/>
                    </div>
                </div>
            </div>
        </SplitterPanel>
        <SplitterPanel class="panel">
            <div class="splitter-panel" style="margin-left: .5rem;">
                <PdfView :url="pdfurl" />
                <!-- <iframe :src="pdfurl"></iframe> -->
            </div>
        </SplitterPanel>
    </Splitter>
    <Dialog v-model:visible="show_log" modal header="Log" :style="{ width: '45rem' }">
        <Monaco v-model:modelValue="compiler_log" language="" style="height: 20rem;" />
    </Dialog>
</template>

<style scoped>
.panel {
    display: flex;
    justify-content: center;
    align-items: center;
}

.panel>* {
    height: 100%;
    width: 100%;
}

.splitter-panel {

    height: 100%;
    width: 100%;
}

iframe {
    height: 100%;
    width: 100%;
}
</style>
