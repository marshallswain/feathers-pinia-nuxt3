<script setup lang="ts">
import { reset } from '@formkit/core'

defineEmits(['openDrawer'])
definePageMeta({
  layout: 'app',
})

const { api } = useFeathers()

async function createContact(fields: any) {
  const result = await api.service('contacts').create(fields)
  reset('contact-form')
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
