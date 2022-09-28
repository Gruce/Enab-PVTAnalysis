<template>
  <!-- Application -->
  <main px="2" mb="15" h="full" dir="ltr">
    <UiTabGroup h="full" :tabs="['CME Checker', 'About']">
      <template #tab-1>
        <PVTAnalysisCMEChecker />
      </template>

      <template #tab-2>
        <h3 text="white">About Tap Selected</h3>
      </template>
    </UiTabGroup>
  </main>
</template>


<script setup>
const props = defineProps({
    app: {
        type: Object,
        required: true,
    },
});
</script>