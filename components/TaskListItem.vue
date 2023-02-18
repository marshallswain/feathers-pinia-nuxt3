<script setup lang="ts">
import type { ModelInstance } from 'feathers-pinia'
import type { Tasks } from 'feathers-pinia-api'
import { useClone } from 'feathers-pinia'
// import InfoIcon from '~icons/feather/info'

interface Props {
  task: ModelInstance<Tasks>
}
const props = defineProps<Props>()
const emit = defineEmits(['next', 'prev'])

const _task = useClone(props, 'task')

// Is the task wrapper focused?
const taskWrapper = ref()
const { focused: isFocused } = useFocus(taskWrapper, { initialValue: true })

onKeyStroke('ArrowUp', (e) => {
  if (isFocused.value) {
    e.preventDefault()
    emit('prev', e)
  }
})

onKeyStroke('ArrowDown', (e) => {
  if (isFocused.value) {
    e.preventDefault()
    emit('next', e)
  }
})
</script>

<template>
  <DaisyFlex
    ref="taskWrapper"
    row
    items-center
    class="group gap-1 focus:bg-black/10 focus:ring-0 rounded-lg px-2 -mx-2 py-1 focus:outline-none"
    tabindex="1"
  >
    <DaisyCheckbox v-model="_task!.isComplete" class="rounded-full" />
    <DaisyText lg class="px-3 h-8 inline-block py-1 min-w-[48px] relative -top-px left-px">
      {{ task.description }}
    </DaisyText>
    <!-- <DaisyTextInput sm v-model="task.description" ghost class="w-full text-lg" /> -->
    <!-- <DaisyButton circle ghost class="opacity-20 group-hover:opacity-100">
        <InfoIcon class="text-xl" />
      </DaisyButton> -->
  </DaisyFlex>
</template>
