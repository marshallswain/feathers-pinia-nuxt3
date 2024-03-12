<script setup lang="ts">
import type { Tweets } from 'feathers-pinia-api'
import type { ServiceInstance } from 'feathers-pinia'

const props = defineProps<{
  tweet: ServiceInstance<Tweets>
}>()

// create avatar initials by splitting on '.' or '_' and taking the first two letters
const initials = computed(() => {
  const [first, second] = props.tweet.name!.split(/\.|_/)
  const firstInitial = first?.slice(0, 1)?.toUpperCase()
  const secondInitial = second?.slice(0, 1)?.toUpperCase()

  // if second is undefined, return first
  return secondInitial ? firstInitial + secondInitial : firstInitial
})
</script>

<template>
  <DaisyCard class="w-full">
    <DaisyCardBody col items-center class="gap-2 bg-base-200 rounded-box p-4 relative">
      <DaisyFlex row class="gap-2 items-start">
        <DaisyAvatar circle class="w-12 flex-shrink-0">
          <span class="text-lg font-bold bg-primary text-primary-content"> {{ initials }} </span>
        </DaisyAvatar>
        <DaisyFlex col items-start class="gap-0.5">
          <DaisyFlex row>
            <DaisyText is="p" bold>
              {{ tweet.name }}
            </DaisyText>
            <!-- Delete Button -->
            <DaisyButton ghost sm circle class="ml-2 absolute top-2 right-2" @click="tweet.remove()">
              <i class="icon-[feather--x] text-xl" />
            </DaisyButton>
          </DaisyFlex>

          <DaisyText is="p" left class="leading-tight">
            {{ tweet.text }}
          </DaisyText>
        </DaisyFlex>
      </DaisyFlex>

      <DaisyCardActions class="justify-evenly">
        <DaisyFlex is="label" row items-center class="hover:text-secondary group">
          <DaisyButton ghost circle class="gap-2">
            <i class="icon-[feather--message-circle] text-xl group-hover:bg-secondary" />
          </DaisyButton>
          <div class="select-none">
            {{ tweet.commentCount }}
          </div>
        </DaisyFlex>

        <DaisyFlex is="label" row items-center class="hover:text-secondary group">
          <DaisyButton ghost circle class="gap-2">
            <i class="icon-[feather--refresh-cw] text-xl group-hover:bg-secondary" />
          </DaisyButton>
          <div class="select-none">
            {{ tweet.retweetCount }}
          </div>
        </DaisyFlex>

        <DaisyFlex is="label" row items-center class="hover:text-secondary group">
          <DaisyButton ghost circle class="gap-2">
            <i class="icon-[feather--heart] text-xl group-hover:bg-secondary" />
          </DaisyButton>
          <div class="select-none">
            {{ tweet.likeCount }}
          </div>
        </DaisyFlex>

        <DaisyFlex is="label" row items-center class="hover:text-secondary group">
          <DaisyButton ghost circle class="gap-2">
            <i class="icon-[feather--bar-chart-2] text-xl group-hover:bg-secondary" />
          </DaisyButton>
          <div class="select-none">
            {{ tweet.viewCount }}
          </div>
        </DaisyFlex>
      </DaisyCardActions>
    </DaisyCardBody>
  </DaisyCard>
</template>
