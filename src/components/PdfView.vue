<template>
    <embed :src="$props.url" type="application/pdf" width="100%" height="100%" />
</template>

<script setup lang="ts">
import VuePdfEmbed from "vue-pdf-embed";

// essential styles
import "vue-pdf-embed/dist/style/index.css";

// optional styles
import "vue-pdf-embed/dist/style/annotationLayer.css";
import "vue-pdf-embed/dist/style/textLayer.css";

const props = defineProps<{
    url: string
}>();
</script>

<style scoped></style>