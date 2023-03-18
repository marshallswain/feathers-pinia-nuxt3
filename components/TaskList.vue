<script setup lang="ts">
const Task = useTaskModel()

const tasks = [1, 2, 3, 4, 5].map((val: string) => Task({ description: val.toString() }).addToStore())

// Is focus inside the task list
const listEl = ref()
const { focused } = useFocusWithin(listEl)

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
  <DaisyCard class="bg-base-200 w-full sm:w-2/3 md:w-1/2 xl:w-1/3 transition-all duration-300">
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

      <DaisyFlex ref="listEl" col class="gap-1 py-1">
        <TaskListItem v-for="task in tasks" :task="task" @prev="handlePrev" @next="handleNext" />
      </DaisyFlex>
    </DaisyCardBody>
  </DaisyCard>
</template>
