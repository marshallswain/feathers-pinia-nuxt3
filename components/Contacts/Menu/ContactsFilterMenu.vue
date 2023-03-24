<script setup lang="ts">
interface Props {
  itemsPerPage: number
}
const props = defineProps<Props>()
const emit = defineEmits(['update:itemsPerPage'])

const { itemsPerPage } = useVModels(props, emit)
</script>

<template>
  <DaisyDropdown end>
    <DaisyButton class="relative rounded-l-none">
      <i class="icon-[feather--search] relative right-0.5" />
      <i class="icon-[feather--chevron-down] absolute right-1" />
    </DaisyButton>

    <DaisyMenu tabindex="0" class="shadow dropdown-content bg-base-200 rounded-box p-2">
      <DaisyMenuItem class="p-2">
        <DaisyTextInput v-model.number="itemsPerPage" />
      </DaisyMenuItem>
      <DaisyMenuItem>
        <span>Test</span>
      </DaisyMenuItem>
    </DaisyMenu>
  </DaisyDropdown>
</template>
