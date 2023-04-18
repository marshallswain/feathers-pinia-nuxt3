<script setup lang="ts">
import type { Tasks } from 'feathers-pinia-api'
import type { FeathersInstance } from '~~/feathers-pinia-3'

const { api } = useFeathers()

const { data: tasks } = api.service('tasks').findInStore({ query: {} })
await api.service('tasks').find({ query: { $limit: 300 } })

const newTask = ref(initTask())
function initTask() {
  return api.service('tasks').new({ description: '', isComplete: false }) as FeathersInstance<Tasks>
}
watch(tasks, (val) => {
  const temp = val.find((i: any) => i.__isTemp)
  if (!temp)
    newTask.value = initTask()
})

function handlePrev(e: KeyboardEvent) {
  const previousEl = (e.target as any).previousElementSibling as HTMLDivElement
  previousEl?.focus()
}
function handleNext(e: KeyboardEvent) {
  const nextEl = (e.target as any).nextElementSibling as HTMLDivElement
  nextEl?.focus()
}
</script>

<template>
  <DaisyCard class="bg-base-100 shadow-xl-uniform border-base-200 w-full sm:w-2/3 md:w-1/2 xl:w-1/3 transition-all duration-300">
    <DaisyCardBody>
      <DaisyFlex row items-center justify-between>
        <DaisyText primary size="4xl" bold>
          Reminders
        </DaisyText>
        <DaisyText primary size="4xl">
          5
        </DaisyText>
      </DaisyFlex>

      <DaisyFlex row items-center justify-between class="mt-3">
        <DaisyFlex row items-center>
          <DaisyText>173 Completed</DaisyText>
          <DaisyText class="block px-1">
            •
          </DaisyText>
          <DaisyLink hover primary class="font-medium">
            Clear
          </DaisyLink>
        </DaisyFlex>

        <DaisyLink hover primary class="font-medium">
          Show
        </DaisyLink>
      </DaisyFlex>

      <hr class="border-t border-base-content/20">

      <DaisyFlex ref="listEl" v-auto-animate col class="gap-1 py-1">
        <TaskListItem
          v-for="task in tasks"
          :key="task._id"
          :task="task"
          @prev="handlePrev"
          @next="handleNext"
        />
        <TaskListItem :task="newTask" is-new />
      </DaisyFlex>
    </DaisyCardBody>
  </DaisyCard>
</template>

<style>
.shadow-xl-uniform {
  filter: drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 0px 8px rgb(0 0 0 / 0.12));
}
</style>
