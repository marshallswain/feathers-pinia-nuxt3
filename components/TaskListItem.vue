<script setup lang="ts">
import type { Tasks } from 'feathers-pinia-api'
import type { FeathersInstance } from '~~/feathers-pinia-3'

interface Props {
  task: FeathersInstance<Partial<Tasks>>
  initialFocus?: boolean
  isNew?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['next', 'prev', 'enter'])

const { api } = useFeathers()

async function save() {
  const clone = props.task.getClone()
  clone?.save()
  clone?.commit()
  setTimeout(async () => {
    clone?.removeFromStore()
  }, 1000)
}

// dynamically create clone on input focus
const inputEl = ref()
// const { focused: isInputFocused } = useFocus(inputEl)

// taskWrapper keyboard shorctus
const taskWrapper = ref()
const { focused: isWrapperFocused } = useFocusWithin(taskWrapper)
const current = computed(() => isWrapperFocused.value ? props.task.clone(undefined, { useExisting: true }) : props.task)

onKeyStroke('ArrowUp', (e) => {
  if (isWrapperFocused.value) {
    e.preventDefault()
    emit('prev', e)
  }
})

onKeyStroke('ArrowDown', (e) => {
  if (isWrapperFocused.value) {
    e.preventDefault()
    emit('next', e)
  }
})

onKeyStroke('Enter', (e) => {
  if (isWrapperFocused.value) {
    e.preventDefault()
    emit('enter', e)
  }
})

watch(isWrapperFocused, (val) => {
  if (!val)
    save()
})
</script>

<template>
  <DaisyFlex
    ref="taskWrapper"
    row
    items-center
    class="group gap-1 focus:ring-0 rounded-lg px-2 -mx-2 py-1 focus:outline-none"
    :class="{ 'focus:bg-primary-focus/10': isWrapperFocused }"
    tabindex="1"
  >
    <DaisyCheckbox
      v-model="current.isComplete"
      :primary="current.isComplete"
      :class="{ 'border-dashed': isNew }"
      class="rounded-full"
    />
    <DaisyTextInput
      ref="inputEl"
      v-model="current.description"
      sm ghost class="w-full text-lg focus:border-none"
    />
    <DaisyButton v-if="!isNew" sm circle ghost class="hidden group-hover:block opacity-20 group-hover:opacity-100" @click="task.remove()">
      <i class="icon-[feather--trash-2] text-xl" />
    </DaisyButton>
  </DaisyFlex>
</template>
