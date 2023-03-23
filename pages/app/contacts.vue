<!-- eslint-disable no-console -->
<script setup lang="ts">
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
function openDeleteDialog(contact: Record<string, any>) {
  modal.title = `Delete ${contact.firstName} ${contact.lastName}?`
  modal.message = 'This cannot be undone.'
  modal.item = contact
  modal.isOpen = true
}
function handleDelete() {
  navigateTo('./')
  modal.item.remove()
}

/* params for sidebar contacts */
const search = ref('')
const debounceSearch = refDebounced(search, 500)
const resultsPerPage = ref(5)
const sidebarParams = computed(() => {
  const query = { $limit: resultsPerPage.value }
  // add these params when search is entered
  if (search.value) {
    const regexSearch = { $regex: debounceSearch.value, $options: 'igm' }
    Object.assign(query, { $or: [{ firstName: regexSearch }, { lastName: regexSearch }] })
  }
  return { query, immediate: true, paginateOnServer: true }
})
const info = api.service('contacts').useFind(sidebarParams)
const { data: sidebarContacts, total, currentPage, pageCount, haveBeenRequested, request, isPending, haveLoaded, next, prev, canNext, canPrev, find, isSsr, toStart } = info

if (isSsr.value)
  await request.value

/* All Contacts */
const { data: allContacts } = api.service('contacts').findInStore({ query: {} })

// current contact
const $route = useRoute()
const id = computed(() => $route.params.id as string)
const { data: currentContact } = api.service('contacts').useGetOnce(id)
const currentOnPage = computed(() => {
  if (id.value == null)
    return false

  const currentIds = sidebarContacts.value.map((i: any) => i[i.__idField])
  return currentIds.includes(id.value)
})
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

        <NuxtPage :total="total" :contact="currentContact" @open-drawer="openDrawer()" />
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
              <DaisyInputGroup class="my-3">
                <DaisyTextInput v-model="search" type="search" placeholder="search " bordered class="w-full" />
                <DaisyButton class="relative">
                  <i class="icon-[feather--search] relative right-0.5" />
                  <i class="icon-[feather--chevron-down] absolute right-1" />
                </DaisyButton>
              </DaisyInputGroup>

              <div v-if="currentContact && !currentOnPage" class="mb-6">
                <DaisyMenuTitle>
                  <span>current item</span>
                </DaisyMenuTitle>

                <DaisyMenuItem @click="closeDrawer()">
                  <DaisyFlex class="active">
                    <span class="flex-grow">{{ currentContact.firstName }} {{ currentContact.lastName }}</span>
                    <!-- Context menu for active contact -->
                    <ContactsContextMenu @open-menu="openDeleteDialog(currentContact)" />
                  </DaisyFlex>
                </DaisyMenuItem>
              </div>

              <DaisyMenuTitle>
                <span>showing {{ sidebarContacts.length }} of {{ total }} contacts</span>
              </DaisyMenuTitle>
              <template v-for="contact in sidebarContacts" :key="contact._id">
                <NuxtLink v-slot="{ navigate, isActive }" :to="`/app/contacts/${contact._id}`" custom>
                  <DaisyMenuItem @click="closeDrawer(); navigate();">
                    <DaisyFlex :class="{ active: isActive }">
                      <span class="flex-grow">{{ contact.firstName }} {{ contact.lastName }}</span>
                      <!-- Context menu for active contact -->
                      <ContactsContextMenu v-if="isActive" @open-menu="openDeleteDialog(contact)" />
                    </DaisyFlex>
                  </DaisyMenuItem>
                </NuxtLink>
              </template>

              <DaisyFlex justify-center class="pt-6">
                <DaisyButtonGroup>
                  <DaisyButton :disabled="!canPrev" @click="prev">
                    <i class="icon-[feather--chevron-left]" />
                  </DaisyButton>
                  <DaisyButton>
                    Page {{ currentPage }} of {{ pageCount }}
                  </DaisyButton>
                  <DaisyButton :disabled="!canNext" @click="next">
                    <i class="icon-[feather--chevron-right]" />
                  </DaisyButton>
                </DaisyButtonGroup>
              </DaisyFlex>
            </div>
          </DaisyMenu>
        </DaisyFlex>
      </DaisyDrawer>
    </DaisyDrawerLayout>
  </DaisyFlex>
</template>
