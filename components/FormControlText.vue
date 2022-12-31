<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
  validationObj?: any
  type?: 'text' | 'password' | 'email'
  placeholder?: string
}>()
const emit = defineEmits(['update:modelValue'])

const modelValue = useVModel(props, 'modelValue', emit)
</script>

<template>
  <DaisyFormControl>
    <DaisyTextInput v-model="modelValue" bordered :placeholder="placeholder" :type="type" />
    <DaisyLabel v-if="validationObj?.$errors.length">
      <DaisyLabelTextAlt class="text-error">
        {{ validationObj?.$errors[0].$message }}
      </DaisyLabelTextAlt>
    </DaisyLabel>
  </DaisyFormControl>
</template>
