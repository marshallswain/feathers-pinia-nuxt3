<!-- eslint-disable no-console -->
<script setup lang="ts">
// https://v3.nuxtjs.org/api/composables/use-head
useHead({
  title: 'Feathers-Pinia',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
    { name: 'charset', content: 'utf-8' },
    { name: 'description', content: 'Feathers-Pinia Example App' },
  ],
  script: [],
  link: [
    { hid: 'favicon', rel: 'icon', type: 'image/svg', href: '/feathersjs.svg' },
  ],
  bodyAttrs: {},
  htmlAttrs: {},
})

const { user } = useAuthStore()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.theme-dark body {
  background-color: black;
  color: white;
}
</style>
