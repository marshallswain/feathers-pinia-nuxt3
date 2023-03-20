<script setup lang="ts">
import { reset } from '@formkit/core'

interface Props {
  contact?: Record<string, any>
  /**
   * Form submission is handled through a prop instead of an event to take advantage of
   * Formkit's auto-disable feature when a promise is returned. All form elements become
   * disabled while the promise is still pending.
   * @param fields the form's values upon submit.
   */
  handleSubmit?: (fields: Record<string, any>) => Promise<void>
}
defineProps<Props>()
defineEmits(['submit'])
</script>

<template>
  <div class="relative">
    <DaisyTooltip tip="Reset the Form" left class="absolute -top-6 right-0">
      <DaisyButton circle ghost @click="reset('contact-form')">
        <i class="icon-[feather--rotate-ccw] text-lg" />
      </DaisyButton>
    </DaisyTooltip>

    <FormKit
      id="contact-form"
      type="form"
      :value="contact"
      @submit="handleSubmit as any"
    >
      <DaisyFlex col class="gap-3">
        <DaisyFlex col class="gap-3 sm:flex-row">
          <div class="w-full">
            <FormKit
              type="text"
              name="firstName"
              validation="required"
              label="First Name"
              help="Enter the contact's first name"
            />
          </div>
          <div class="w-full">
            <FormKit
              type="text"
              name="lastName"
              validation=""
              label="Last Name"
              help="Enter the contact's last name"
            />
          </div>
        </DaisyFlex>

        <DaisyFlex col class="sm:flex-row gap-3">
          <div class="w-full sm:w-2/3">
            <FormKit
              type="email"
              name="email"
              validation=""
              label="Email"
              help="Enter the contact's email address"
            />
          </div>

          <div class="w-full sm:w-1/3">
            <FormKit
              type="tel"
              name="phone"
              validation=""
              label="Phone"
              help="Enter the contact's phone number"
            />
          </div>
        </DaisyFlex>

        <DaisyCollapse toggle arrow class="bg-base-200 border border-base-300 rounded-box mb-3">
          <DaisyCollapseTitle class="font-bold">
            Address
          </DaisyCollapseTitle>
          <DaisyCollapseContent>
            <div class="bg-base-100 mb-3 rounded-lg p-4 py-3">
              <div class="w-full sm:w-2/3">
                <FormKit
                  type="text"
                  name="address1"
                  validation=""
                  label="Address"
                  help="Enter the contact's address"
                />
              </div>

              <DaisyFlex col class="sm:flex-row gap-3">
                <div class="w-full sm:w-1/3">
                  <FormKit
                    type="text"
                    name="city"
                    validation=""
                    label="City"
                    help="Enter the contact's city"
                  />
                </div>
                <div class="w-full sm:w-1/3">
                  <FormKit
                    type="text"
                    name="state"
                    validation=""
                    label="State"
                    help="Enter the contact's state"
                  />
                </div>
                <div class="w-full sm:w-1/3">
                  <FormKit
                    type="text"
                    name="zipcode"
                    validation=""
                    label="Zipcode"
                    help="Enter the contact's zipcode"
                  />
                </div>
              </DaisyFlex>
            </div>
          </DaisyCollapseContent>
        </DaisyCollapse>
      </DaisyFlex>
    </FormKit>
  </div>
</template>
