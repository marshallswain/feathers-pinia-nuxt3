<script setup lang="ts">
defineEmits(['openDrawer'])
definePageMeta({
  layout: 'app',
})

const $route = useRoute()
const { api } = useFeathers()

const { data: contact } = api.service('contacts').useGetOnce($route.params.id as string)

async function createContact(fields: any) {
  await api.service('contacts').patch($route.params.id as string, fields)
}
</script>

<template>
  <div>
    <DaisyCard bordered>
      <DaisyCardBody class="gap-4">
        <DaisyCardTitle class="font-bold">
          Add Contact
        </DaisyCardTitle>

        <ContactsForm :contact="contact" :handle-submit="createContact" />
      </DaisyCardBody>
    </DaisyCard>
  </div>
</template>
