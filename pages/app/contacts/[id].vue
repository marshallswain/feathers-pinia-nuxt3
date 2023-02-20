<script setup lang="ts">
definePageMeta({
  layout: 'app',
})
</script>

<template>
  <DaisyFlex col items-center class="h-full gap-2 mx-auto container">
    <DaisyDrawerLayout mobile class="w-full h-full m-6 gap-3">
      <DaisyDrawerLayoutContent v-slot="{ openDrawer }" class="flex py-3">
        <DaisyButton primary class="lg:hidden" @click="() => openDrawer()">
          Open Contact List
        </DaisyButton>
      </DaisyDrawerLayoutContent>

      <DaisyDrawer v-slot="{ closeDrawer }" class="rounded-box border border-base-200">
        <ContactsMenu v-bind="{ closeDrawer }" />
      </DaisyDrawer>
    </DaisyDrawerLayout>
  </DaisyFlex>
</template>
