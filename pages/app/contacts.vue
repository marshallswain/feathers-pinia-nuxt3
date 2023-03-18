<script setup lang="ts">
definePageMeta({
  layout: 'app',
  keepalive: true,
})
</script>

<template>
  <DaisyFlex col items-center class="h-full gap-2 mx-auto lg:container px-1 sm:px-2 md:px-4 lg:px-0">
    <DaisyDrawerLayout mobile class="w-full h-full m-6 gap-3">
      <DaisyDrawerLayoutContent v-slot="{ openDrawer }" class="flex  py-3">
        <NuxtPage @open-drawer="openDrawer()" />
      </DaisyDrawerLayoutContent>

      <DaisyDrawer v-slot="{ closeDrawer }" class="rounded-box border border-base-200">
        <DaisyMenu class="relative p-3 overflow-y-auto menu w-full sm:w-80 bg-base-100 rounded-lg">
          <RouterLink v-slot="{ isActive, navigate }" to="/app/contacts/new" custom>
            <DaisyButton :primary="isActive" :neutral="!isActive" @click="navigate">
              Create Contact
            </DaisyButton>
          </RouterLink>

          <DaisyMenuTitle class="mt-4 ">
            <p>Select a Contact</p>
          </DaisyMenuTitle>
          <DaisyMenuItem @click="() => closeDrawer()">
            <a>Menu Item</a>
          </DaisyMenuItem>

          <DaisyMenuItem @click="() => closeDrawer()">
            <a>Menu Item</a>
          </DaisyMenuItem>
        </DaisyMenu>
      </DaisyDrawer>
    </DaisyDrawerLayout>
  </DaisyFlex>
</template>
