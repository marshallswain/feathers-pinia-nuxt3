<script setup lang="ts">
defineEmits(['openDrawer'])
definePageMeta({
  layout: 'app',
})

const { api } = useFeathers()

async function createContact(fields: any) {
  const result = await api.service('contacts').create(fields)
  await navigateTo(`${result._id}`)
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
