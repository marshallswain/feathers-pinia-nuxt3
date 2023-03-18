<script setup lang="ts">
defineEmits(['openDrawer'])
definePageMeta({
  layout: 'app',
})
</script>

<template>
  <div>
    <DaisyCard bordered>
      <DaisyCardBody class="gap-4">
        <DaisyCardTitle class="font-bold">
          Add Contact
        </DaisyCardTitle>

        <FormKit type="form">
          <DaisyFlex row class="gap-3">
            <div class="w-full md:1/2">
              <FormKit
                id="firstName"
                type="text"
                name="firstName"
                validation="required"
                label="First Name"
                help="Enter the contact's first name"
              />
            </div>
            <div class="w-full md:1/2">
              <FormKit
                id="lastName"
                type="text"
                name="lastName"
                validation=""
                label="Last Name"
                help="Enter the contact's last name"
              />
            </div>
          </DaisyFlex>
        </FormKit>
      </DaisyCardBody>
    </DaisyCard>
  </div>
</template>
