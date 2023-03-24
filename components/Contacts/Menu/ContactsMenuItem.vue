<script setup lang="ts">
interface Props {
  contact: Record<string, any>
  isActive: boolean
}
defineProps<Props>()
defineEmits(['openMenu'])
</script>

<template>
  <DaisyMenuItem>
    <DaisyFlex :class="{ active: isActive }">
      <span class="flex-grow">{{ contact.firstName }} {{ contact.lastName }}</span>
      <ContactsContextMenu v-if="isActive" @open-menu="$emit('openMenu', $event)" />
    </DaisyFlex>
  </DaisyMenuItem>
</template>
