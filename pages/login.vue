<script setup lang="ts">
const authStore = useAuthStore()
const { api } = useFeathers()
const inSignupMode = ref(false)

interface State {
  email: string
  password: string
  password_confirm: string
}

async function loginAndRedirect(fields: State) {
  return authStore
    .authenticate({ strategy: 'local', ...fields })
    .then(() => {
      const redirectTo = authStore.loginRedirect || '/app'
      authStore.loginRedirect = null
      navigateTo(redirectTo)
    })
    .catch((error: any) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}
async function handleSignup(fields: State) {
  const { email, password } = fields
  await api.service('users').create({ email, password })
  loginAndRedirect(fields)
}
async function handleSubmit(fields: State) {
  return inSignupMode.value ? handleSignup(fields) : loginAndRedirect(fields)
}
</script>

<template>
  <div class="pt-16">
    <DaisyCard class="max-w-xs bg-base-200 mx-auto">
      <DaisyCardBody class="gap-4">
        <DaisyText medium center size="2xl">
          {{ inSignupMode ? 'Signup' : 'Login' }}
        </DaisyText>

        <FormKit
          id="contact-form"
          type="form"
          class="flex flex-col gap-4"
          :submit-label="inSignupMode ? 'Signup' : 'Login'"
          :submit-attrs="{
            inputClass: 'btn-block mt-3',
          }"
          @submit="handleSubmit"
        >
          <DaisyFlex col class="gap-2">
            <FormKit
              type="email"
              name="email"
              label="Email"
              validation="required|email"
            />
            <FormKit
              type="password"
              name="password"
              label="Password"
              validation="required|length:4"
            />
            <div
              class="overflow-hidden transition-all duration-300"
              :class="[inSignupMode ? 'max-h-32 mt-0' : 'max-h-0 -mt-4']"
            >
              <FormKit
                v-if="inSignupMode"
                type="password"
                name="password_confirm"
                label="Confirm Password"
                validation="required|confirm|length:4"
              />
            </div>
          </DaisyFlex>
        </FormKit>

        <div class="text-center">
          <DaisyFlex v-if="inSignupMode" col>
            <span>Already signed up?</span>
            <DaisyLink @click="inSignupMode = !inSignupMode">
              <span>Login</span>
            </DaisyLink>
          </DaisyFlex>

          <DaisyFlex v-else col>
            <span>Need an account?</span>
            <DaisyLink @click="inSignupMode = !inSignupMode">
              <span>Signup</span>
            </DaisyLink>
          </DaisyFlex>
        </div>
      </DaisyCardBody>
    </DaisyCard>
  </div>
</template>
