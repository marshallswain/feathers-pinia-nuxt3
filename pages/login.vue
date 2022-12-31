<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required, sameAs } from '@vuelidate/validators'
import { _ } from '@feathersjs/commons'

const authStore = useAuthStore()
const User = useUserModel()
const inSignupMode = ref(false)
const state = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const rules = {
  email: { required, email },
  password: {
    required,
    minLength: minLength(4),
  },
  confirmPassword: {
    required,
    minLength: minLength(4),
    sameAsPassword: helpers.withMessage('must match password', sameAs(computed(() => state.password))),
  },
}
// Validation Rules
const conditionalRules = computed(() => {
  return inSignupMode.value ? rules : _.omit(rules, 'confirmPassword')
})
const v$ = useVuelidate(conditionalRules, state)

const authenticate = () => {
  authStore.authenticate({ strategy: 'local', ...state })
}
const handleLogin = async () => {
  const isValid = await v$.value.$validate()
  if (isValid)
    authenticate()
}
const handleSignup = async () => {
  const isValid = await v$.value.$validate()
  if (isValid) {
    const { email, password } = state
    await User({ email, password }).save()
    authenticate()
  }
}
</script>

<template>
  <div class="pt-16">
    <DaisyCard class="max-w-xs bg-base-200 mx-auto">
      <DaisyCardBody class="gap-4">
        <DaisyText medium size="2xl">
          <span v-if="inSignupMode">Signup</span>
          <span v-else>Login</span>
        </DaisyText>

        <form class="flex flex-col gap-4">
          <DaisyFlex col class="gap-2">
            <FormControlText
              v-model="state.email" :validation-obj="v$.password" placeholder="enter email"
              type="email"
            />
            <FormControlText
              v-model="state.password" :validation-obj="v$.password" placeholder="enter password"
              type="password"
            />
            <div
              class="overflow-hidden transition-all duration-300"
              :class="[inSignupMode ? 'max-h-20 mt-0' : 'max-h-0 -mt-4']"
            >
              <FormControlText
                v-model="state.confirmPassword" :validation-obj="v$.confirmPassword"
                placeholder="confirm password" type="password"
              />
            </div>
          </DaisyFlex>

          <DaisyButton v-if="inSignupMode" primary @click.prevent="handleSignup">
            Signup
          </DaisyButton>
          <DaisyButton v-else primary @click.prevent="handleLogin">
            Login
          </DaisyButton>

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
        </form>
      </DaisyCardBody>
    </DaisyCard>
  </div>
</template>
