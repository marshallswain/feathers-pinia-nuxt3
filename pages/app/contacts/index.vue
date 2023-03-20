<script setup lang="ts">
interface Props {
  list: Record<string, any>[]
}
defineProps<Props>()
defineEmits(['openDrawer'])
definePageMeta({
  layout: 'app',
})
</script>

<template>
  <DaisyFlex col items-start class="gap-1">
    <DaisyFlex col class="w-full rounded-box bg-base-200 sm:flex-row">
      <div
        class="h-80 w-full flex-grow md:w-96 bg-cover bg-center rounded-t-box sm:rounded-tr-none sm:rounded-l-box"
        style="background-image: url('https://source.unsplash.com/random/600×600/?cats')"
      />
      <DaisyFlex col items-center justify-center grow class="gap-1 pt-6 pb-8 px-4 mx-auto text-center sm:text-left">
        <DaisyText bold xl>
          You have <span class="bg-base-300 inline-block px-2 rounded">{{ list.length }}</span> contact{{ list.length === 1 ? '' : 's' }}.
        </DaisyText>
        <DaisyButton wide class="lg:hidden" @click="$emit('openDrawer')">
          Show Contacts
        </DaisyButton>
        <NuxtLink v-slot="{ navigate }" to="contacts/new">
          <DaisyButton primary wide @click="navigate">
            Add Contact
          </DaisyButton>
        </NuxtLink>
      </DaisyFlex>
    </DaisyFlex>
  </DaisyFlex>
</template>
