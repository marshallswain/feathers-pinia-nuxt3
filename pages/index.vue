<script setup lang="ts">
const colorMode = useColorMode()
const themes = useThemes()
</script>

<template>
  <div>
    <DaisyHero class="h-[32rem]">
      <DaisyHeroContent>
        <DaisyFlex col center class="max-w-xl text-center gap-5">
          <DaisyText is="h1" size="5xl" bold>
            Feathers-Pinia + Nuxt3
          </DaisyText>
          <DaisyText xl>
            Welcome to the Perfect Real-Time Stack.
          </DaisyText>
          <div>
            <NuxtLink to="login">
              <DaisyButton primary>
                Get Started
              </DaisyButton>
            </NuxtLink>
          </div>
        </DaisyFlex>
      </DaisyHeroContent>
    </DaisyHero>

    <DaisyCard class="bg-base-200 mx-auto max-w-md text-center">
      <DaisyCardBody class="gap-4">
        <DaisyText size="3xl">
          Set The Mood
        </DaisyText>
        <DaisyText size="lg">
          With
          <DaisyLink primary href="https://daisyui.com" target="blank" class="font-bold">
            DaisyUI
          </DaisyLink>
          under the hood, you can <br>pick your favorite theme.
        </DaisyText>

        <DaisyFormControl class="mx-auto w-60">
          <DaisySelect v-model="colorMode.preference" :options="themes" class="select select-bordered w-full max-w-xs" />
        </DaisyFormControl>
      </DaisyCardBody>
    </DaisyCard>
  </div>
</template>
