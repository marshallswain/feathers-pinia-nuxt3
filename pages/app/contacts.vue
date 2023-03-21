<script setup lang="ts">
import type { Contacts } from 'feathers-pinia-api'

definePageMeta({
  layout: 'app',
  keepalive: true,
})

const { api } = useFeathers()

/* delete contact modal */
const modal = reactive({
  isOpen: false,
  title: '',
  message: '',
  item: null as any,
})
function openDeleteDialog(contact: Contacts) {
  modal.title = `Delete ${contact.firstName} ${contact.lastName}?`
  modal.message = 'This cannot be undone.'
  modal.item = contact
  modal.isOpen = true
}
function handleDelete() {
  navigateTo('./')
  modal.item.remove()
}

/* Sidebar Contacts */
const search = ref('')
const resultsPerPage = ref(10)
const sidebarParams = computed(() => {
  const query = { $limit: resultsPerPage.value }
  // add these params when search is entered
  if (search.value) {
    const regexSearch = { $regex: search.value, $options: 'igm' }
    Object.assign(query, {
      $or: [
        { firstName: regexSearch }, { lastName: regexSearch }],
    })
  }
  return { query, immediate: false }
})
const info = api.service('contacts').useFind(sidebarParams)
const { data: sidebarContacts, isPending, haveLoaded, next, prev, canNext, canPrev, find, isSsr, toStart } = info

if (isSsr.value)
  await find({ query: { $limit: 300 } })

/* All Contacts */
const { data: allContacts } = api.service('contacts').findInStore({ query: {} })
</script>

<template>
  <DaisyFlex col items-center class="h-full gap-2 mx-auto lg:container transition-all duration-300 px-1 sm:px-2 md:px-4 lg:px-0">
    <DeleteDialog
      v-model:is-open="modal.isOpen"
      :title="modal.title"
      :message="modal.message"
      :item="modal.item"
      @delete="handleDelete"
    />

    <DaisyDrawerLayout mobile class="w-full h-full m-6 gap-3 border-none!">
      <DaisyDrawerLayoutContent v-slot="{ openDrawer }">
        <DaisyButtonGroup class="lg:hidden">
          <DaisyButton ghost class="gap-2" @click="openDrawer()">
            <i class="icon-[feather--menu] text-xl" />
            Open List
          </DaisyButton>
        </DaisyButtonGroup>

        <NuxtPage :contacts="allContacts" @open-drawer="openDrawer()" />
      </DaisyDrawerLayoutContent>

      <DaisyDrawer v-slot="{ closeDrawer }" class="rounded-box ">
        <DaisyFlex col class="gap-3 transition-all duration-300 w-full sm:w-2/3 md:w-80">
          <DaisyMenu
            class="relative p-3 overflow-y-auto menu bg-base-100 rounded-box border border-base-200 flex-grow"
          >
            <DaisyFlex justify-end class="-mt-3 -mr-3 lg:hidden">
              <DaisyButton ghost square class="rounded-box" @click="closeDrawer()">
                <i class="icon-[feather--x] text-2xl" />
              </DaisyButton>
            </DaisyFlex>

            <RouterLink v-slot="{ isActive, navigate }" to="/app/contacts/new" custom>
              <DaisyButton :primary="!isActive" :neutral="isActive" @click="navigate(); closeDrawer();">
                Add Contact
              </DaisyButton>
            </RouterLink>

            <div>
              <DaisyTextInput v-model="search" type="search" placeholder="search contacts" bordered class="my-3 w-full" />

              <template v-for="contact in sidebarContacts" :key="contact._id">
                <NuxtLink v-slot="{ navigate, isActive }" :to="`/app/contacts/${contact._id}`" custom>
                  <DaisyMenuItem @click="closeDrawer(); navigate();">
                    <DaisyFlex :class="{ active: isActive }">
                      <span class="flex-grow">{{ contact.firstName }} {{ contact.lastName }}</span>
                      <!-- Context menu for active contact -->
                      <DaisyDropdown end>
                        <DaisyButton is="label" v-if="isActive" ghost sm circle class="-m-2" tabindex="0">
                          <i class="icon-[feather--menu]" />
                        </DaisyButton>
                        <DaisyMenu tabindex="0" class="shadow dropdown-content bg-base-200 rounded-box">
                          <DaisyMenuItem>
                            <DaisyButton error class="w-32" @click="openDeleteDialog(contact)">
                              <span>Delete</span>
                              <i class="icon-[feather--trash-2]" />
                            </DaisyButton>
                          </DaisyMenuItem>
                        </DaisyMenu>
                      </DaisyDropdown>
                    </DaisyFlex>
                  </DaisyMenuItem>
                </NuxtLink>
              </template>
            </div>
          </DaisyMenu>
        </DaisyFlex>
      </DaisyDrawer>
    </DaisyDrawerLayout>
  </DaisyFlex>
</template>
