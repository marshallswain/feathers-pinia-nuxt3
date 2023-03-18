<script setup lang="ts">
definePageMeta({
  layout: 'app',
  keepalive: true,
})
</script>

<template>
  <DaisyFlex col items-center class="h-full gap-2 mx-auto lg:container transition-all duration-300 px-1 sm:px-2 md:px-4 lg:px-0">
    <DaisyDrawerLayout mobile class="w-full h-full m-6 gap-3 border-none!">
      <DaisyDrawerLayoutContent v-slot="{ openDrawer }">
        <NuxtPage @open-drawer="openDrawer()" />
      </DaisyDrawerLayoutContent>

      <DaisyDrawer v-slot="{ closeDrawer }" class="rounded-box ">
        <DaisyFlex col class="gap-3">
          <DaisyMenu
            class="
              relative p-3 overflow-y-auto menu bg-base-100 rounded-box border border-base-200
              transition-all duration-300 w-full sm:w-2/3 md:w-80
            "
          >
            <RouterLink v-slot="{ isActive, navigate }" to="/app/contacts/new" custom>
              <DaisyButton :primary="isActive" :neutral="!isActive" @click="navigate">
                Add Contact
              </DaisyButton>
            </RouterLink>

            <DaisyMenuTitle class="mt-4 !text-base">
              Select a Contact
            </DaisyMenuTitle>
            <DaisyMenuItem @click="() => closeDrawer()">
              <a>Menu Item</a>
            </DaisyMenuItem>
            <DaisyMenuItem @click="() => closeDrawer()">
              <a>Menu Item</a>
            </DaisyMenuItem>
          </DaisyMenu>
        </DaisyFlex>
      </DaisyDrawer>
    </DaisyDrawerLayout>
  </DaisyFlex>
</template>
