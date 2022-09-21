<script setup lang="ts">
const { $api } = useFeathers()
const { User, userStore } = useUsers()
// const { Task, taskStore } = useTasks()

const findData = userStore.useFind({ query: {}, onServer: true })
const user = new User({ email: 'foo', _id: 'bar' }).addToStore()
</script>

<template>
  <div>
    <h1>Home</h1>

    <p>{{ user }}</p>
    <p>{{ user.tasks }}</p>
  </div>
</template>
