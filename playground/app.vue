<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
  import { useAppManager } from '#imports'

  const appManager = useAppManager()
  // App Configuration
  appManager.addApp({
      "name": "PVTAnalysis",
      "title": "تحليل الموائع المكمنية",
      "minWidth": 400,
      "minHeight": 300,
      "maximized": true
  })
</script>