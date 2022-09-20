<script setup lang="ts">
const { $api } = useFeathers()
const { User, userStore } = useUsers()
const { Task, taskStore } = useTasks()

const user = new User()
</script>

<template>
  <div>
    <h1>Home</h1>

    <p>{{ user }}</p>
  </div>
</template>
