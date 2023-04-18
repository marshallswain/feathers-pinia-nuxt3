<script setup lang="ts">
import type { Contacts } from 'feathers-pinia-api'
import type { FeathersInstance } from '~~/feathers-pinia-3'

interface Props {
  contact: FeathersInstance<Contacts>
}
const props = defineProps<Props>()
defineEmits(['openDrawer'])
definePageMeta({
  layout: 'app',
})

async function patchContact(fields: any) {
  await props.contact.save({ diff: fields })
}
</script>

<template>
  <div>
    <DaisyCard bordered>
      <DaisyCardBody class="gap-4">
        <DaisyCardTitle class="font-bold">
          Edit Contact
        </DaisyCardTitle>

        <ContactsForm
          :contact="contact"
          :handle-submit="patchContact"
          :disabled="!contact?._id"
        />
      </DaisyCardBody>
    </DaisyCard>
  </div>
</template>
