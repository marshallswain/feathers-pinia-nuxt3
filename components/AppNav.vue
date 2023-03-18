<script setup lang="ts">
// import UserIcon from '~icons/feather/user'
// import ChevronDownIcon from '~icons/feather/chevron-down'
// import LoginIcon from '~icons/feather/log-in'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <DaisyNavbar class="bg-neutral/30">
    <DaisyNavbarStart>
      <NuxtLink to="/" class="flex flex-row gap-2 items-center">
        <i class="icon-[logos--feathersjs] text-2xl bg-white rounded-full" />
        <DaisyText class="text-sm lg:text-xl">
          Feathers-Pinia
        </DaisyText>
      </NuxtLink>
    </DaisyNavbarStart>

    <DaisyNavbarCenter>
      <DaisyButtonGroup>
        <NuxtLink v-slot="{ isActive, navigate }" to="/app" custom>
          <DaisyButton :primary="isActive" class="transition-all duration-300 gap-2 btn-sm sm:btn-md" @click="navigate">
            <i class="icon-[feather--home] text-xl" />
            <span class="hidden lg:inline-block">Home</span>
          </DaisyButton>
        </NuxtLink>

        <NuxtLink v-slot="{ isActive, navigate }" to="/app/reminders" custom>
          <DaisyButton :primary="isActive" class="transition-all duration-300 gap-2 btn-sm sm:btn-md" @click="navigate">
            <i class="icon-[feather--list] text-xl" />
            <span class="hidden lg:inline-block">Reminders</span>
          </DaisyButton>
        </NuxtLink>

        <NuxtLink v-slot="{ navigate, isActive }" to="/app/contacts" custom>
          <DaisyButton :primary="isActive" class="transition-all duration-300 gap-2 btn-sm sm:btn-md" @click="navigate">
            <i class="icon-[feather--users] text-xl" />
            <span class="hidden lg:inline-block">Contacts</span>
          </DaisyButton>
        </NuxtLink>
      </DaisyButtonGroup>
    </DaisyNavbarCenter>

    <DaisyNavbarEnd>
      <DaisyDropdown v-if="authStore.user" end>
        <DaisyButton circle class="relative">
          <i class="icon-[feather--user] text-xl" />
          <i class="icon-[fe--drop-down] absolute right-1 text-[9px]" />
        </DaisyButton>
        <DaisyDropdownContent>
          <DaisyMenu class="bg-base-300 shadow-lg rounded-lg whitespace-nowrap">
            <DaisyMenuItem>
              <NuxtLink to="/app/me">
                <i class="icon-[feather--user] text-xl" />
                My Profile
              </NuxtLink>
            </DaisyMenuItem>
            <DaisyMenuItem>
              <a href="javascript://" @click="logout"><i class="icon-[feather--log-out]" /> Logout</a>
            </DaisyMenuItem>
          </DaisyMenu>
        </DaisyDropdownContent>
      </DaisyDropdown>

      <NuxtLink v-else to="/login">
        <DaisyTooltip bottom tip="Login">
          <DaisyButton circle>
            <i class="icon-[feather--log-in]" />
          </DaisyButton>
        </DaisyTooltip>
      </NuxtLink>
    </DaisyNavbarEnd>
  </DaisyNavbar>
</template>
