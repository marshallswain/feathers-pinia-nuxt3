<script setup lang="ts">
definePageMeta({
  layout: 'app',
})
</script>

<template>
  <DaisyFlex col items-center class="h-full gap-2 mx-auto container">
    <DaisyDrawerLayout mobile class="w-full h-full m-6 gap-3">
      <DaisyDrawerLayoutContent v-slot="{ openDrawer }" class="flex py-3">
        <RouterView />
        <DaisyButton primary class="lg:hidden" @click="() => openDrawer()">
          Open Contact List
        </DaisyButton>
      </DaisyDrawerLayoutContent>

      <DaisyDrawer v-slot="{ closeDrawer }" class="rounded-box border border-base-200">
        <DaisyMenu class="relative p-3 overflow-y-auto menu w-80 ">
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
