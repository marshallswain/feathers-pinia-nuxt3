<script setup lang="ts">
import { faker } from '@faker-js/faker'

definePageMeta({
  layout: 'app',
})

const { api } = useFeathers()
const tweetParams = computed(() => {
  return {
    query: {
      $sort: {
        createdAt: -1,
      },
      $limit: 10,
    },
  }
})

const { data: tweets, next, isSsr, request, find } = api.service('tweets').useFind(tweetParams, { paginateOn: 'hybrid' })

if (isSsr.value)
  await request.value

function createRandomTweets(count = 10) {
  for (let i = 0; i < count; i++) {
    api.service('tweets').create({
      name: faker.internet.userName(),
      text: faker.lorem.sentence(),
    })
  }
}
</script>

<template>
  <DaisyFlex col items-center class="h-full gap-2 text-center pt-8 container mx-auto">
    <DaisyText size="5xl">
      Tweets
    </DaisyText>

    <TweetComposer class="mb-4" />

    <DaisyFlex col items-center class="gap-3 w-1/3">
      <Tweet v-for="tweet in tweets" :key="tweet._id" :tweet="tweet" />
    </DaisyFlex>

    <DaisyFlex row items-center class="gap-3 w-1/3 ">
      <DaisyButton square @click="find()">
        Find
      </DaisyButton>

      <DaisyButton @click="next()">
        Load More
      </DaisyButton>

      <DaisyButton @click="createRandomTweets(10)">
        Create 10 random tweets
      </DaisyButton>
    </DaisyFlex>
  </DaisyFlex>
</template>
