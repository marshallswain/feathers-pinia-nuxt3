<script setup lang="ts">
defineEmits(['openDrawer'])
definePageMeta({
  layout: 'app',
})

async function createContact(fields: any) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // eslint-disable-next-line no-console
  console.log(fields)
}
</script>

<template>
  <div>
    <DaisyCard bordered>
      <DaisyCardBody class="gap-4">
        <DaisyCardTitle class="font-bold">
          Add Contact
        </DaisyCardTitle>

        <ContactsForm :handle-submit="createContact" />
      </DaisyCardBody>
    </DaisyCard>
  </div>
</template>
