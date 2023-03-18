<script setup lang="ts">
defineEmits(['openDrawer'])
definePageMeta({
  layout: 'app',
})
</script>

<template>
  <div class="flex flex-col">
    Index page
    <DaisyButton primary class="lg:hidden" @click="$emit('openDrawer')">
      Open Contact List
    </DaisyButton>
  </div>
</template>
