<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  message?: string
  item: Record<string, any> | null
}
const props = withDefaults(defineProps<Props>(), {
  title: 'Delete this record?',
  message: 'This cannot be undone.',
})
const emit = defineEmits(['update:isOpen', 'delete'])

const isModalOpen = computed({
  get: () => props.isOpen,
  set: val => emit('update:isOpen', val),
})
</script>

<template>
  <DaisyModalWrapper v-model="isModalOpen" name="my-modal">
    <DaisyModal>
      <DaisyModalBox>
        <h3 class="text-lg font-bold">
          {{ title }}
        </h3>
        <p class="py-4">
          {{ message }}
        </p>
        <DaisyModalAction>
          <DaisyButton ghost @click="isModalOpen = false">
            Cancel
          </DaisyButton>
          <DaisyButton error @click="isModalOpen = false; $emit('delete')">
            Delete
          </DaisyButton>
        </DaisyModalAction>
      </DaisyModalBox>
    </DaisyModal>
  </DaisyModalWrapper>
</template>
