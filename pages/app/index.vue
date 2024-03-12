<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

definePageMeta({
  layout: 'app',
})

async function logout() {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <DaisyFlex col items-center justify-center class="h-full gap-2 text-center">
    <DaisyText size="7xl">
      App Home
    </DaisyText>
    <DaisyText size="4xl">
      You have arrived!
    </DaisyText>
    <DaisyText class="mt-5">
      You logged in like a boss.
    </DaisyText>
    <RouterLink to="/">
      <DaisyButton primary>
        Return to Home
      </DaisyButton>
    </RouterLink>
  </DaisyFlex>
</template>
