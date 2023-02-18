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
const errorMsg = computed(() => props.validationObj?.$errors[0]?.$message || '')
</script>

<template>
  <DaisyFormControl>
    <DaisyTextInput v-model="modelValue" bordered :placeholder="placeholder" :type="type" />
    <div
      class="overflow-hidden transition-all duration-500"
      :class="[errorMsg ? 'max-h-12 mt-0' : 'max-h-0']"
    >
      <DaisyLabel class="min-h-8">
        <DaisyLabelTextAlt class="text-error">
          {{ errorMsg }}
        </DaisyLabelTextAlt>
      </DaisyLabel>
    </div>
  </DaisyFormControl>
</template>
