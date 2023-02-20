<script setup lang="ts">
const emit = defineEmits(['select'])

function selectItem(item: any) {
  emit('select', item)
}
</script>

<template>
  <DaisyMenu class="relative p-3 overflow-y-auto menu w-80 ">
    <RouterLink v-slot="{ isActive, navigate }" to="/app/contacts/new" custom>
      <DaisyButton :primary="isActive" :neutral="!isActive" @click="navigate">
        Create Contact
      </DaisyButton>
    </RouterLink>

    <DaisyMenuTitle class="mt-4 ">
      <p>Select a Contact</p>
    </DaisyMenuTitle>

    <DaisyMenuItem @click="() => selectItem(null)">
      <a>Menu Item</a>
    </DaisyMenuItem>
  </DaisyMenu>
</template>
