<script setup lang="ts">
const { api } = useFeathers()
const auth = useAuthStore()
const text = ref('')

function createTweet() {
  if (text.value) {
    api.service('tweets').create({
      name: auth.user.email,
      text: text.value,
    })
    text.value = ''
  }
}
</script>

<template>
  <DaisyFlex is="form" col class="gap-2 w-1/3 border border-primary rounded-box p-4" @submit.prevent="createTweet">
    <DaisyFlex row class="gap-2">
      <DaisyAvatar circle class="w-12">
        <span class="text-lg font-bold bg-primary text-primary-content"> MT </span>
      </DaisyAvatar>
      <DaisyFlex col items-start class="w-full">
        <DaisyTextInput v-model="text" placeholder="What's happening?" class="w-full" />
      </DaisyFlex>
    </DaisyFlex>

    <DaisyFlex row justify-between>
      <DaisyFlex row class="gap-2">
        <DaisyButton ghost sm circle class="rounded-full">
          <i class="icon-[feather--image] text-xl" />
        </DaisyButton>

        <DaisyButton ghost sm circle class="rounded-full">
          <i class="icon-[feather--video] text-xl" />
        </DaisyButton>

        <DaisyButton ghost sm circle class="rounded-full">
          <i class="icon-[feather--smile] text-xl" />
        </DaisyButton>

        <DaisyButton ghost sm circle class="rounded-full">
          <i class="icon-[feather--map-pin] text-xl" />
        </DaisyButton>
      </DaisyFlex>

      <DaisyButton type="submit" sm class="w-1/3 rounded-full">
        Tweet
      </DaisyButton>
    </DaisyFlex>
  </DaisyFlex>
</template>
