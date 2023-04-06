<!-- eslint-disable no-console -->
<script setup lang="ts">
definePageMeta({
  layout: 'app',
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

const limit = ref(5)
const skip = ref(0)

const sidebarParams = computed(() => {
  const query = { }
  // add these params when search is entered
  if (search.value) {
    const regexSearch = { $regex: debounceSearch.value, $options: 'igm' }
    Object.assign(query, { $or: [{ firstName: regexSearch }, { lastName: regexSearch }] })
  }
  return { query }
})
const service = api.service('contacts')
const info = service.useFind(sidebarParams, { pagination: { limit, skip }, paginateOnServer: true, debounce: 10 })
const { data: sidebarContacts, total, currentPage, pageCount, haveBeenRequested, request, isPending, haveLoaded, next, prev, canNext, canPrev, isSsr, toStart, toEnd } = info

if (isSsr.value)
  await request.value

console.log(total.value)

// current contact
const $route = useRoute()
const id = computed(() => $route.params.id as string)
const { data: currentContact, request: getRequest, hasLoaded } = api.service('contacts').useGetOnce(id)
if (isSsr)
  await getRequest.value

const currentOnPage = computed(() => {
  if (id.value == null)
    return false

  const currentIds = sidebarContacts.value.map((i: any) => i[i.__idField])
  return currentIds.includes(id.value)
})
const shouldShowExtra = computed(() => !currentOnPage.value && currentContact.value)
const isExtraVisible = ref(shouldShowExtra.value)

watch(() => shouldShowExtra.value, (val) => {
  isExtraVisible.value = val
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

            <DaisyInputGroup class="my-3">
              <DaisyTextInput v-model="search" type="search" placeholder="search " bordered class="w-full" />
              <ContactsFilterMenu v-model:items-per-page="limit" />
            </DaisyInputGroup>

            <div class="min-h-[360px]">
              <div v-auto-animate="{ duration: 250 }" class="pb-6">
                <div v-if="isExtraVisible">
                  <DaisyMenuTitle>
                    <span>current item</span>
                  </DaisyMenuTitle>

                  <ContactsMenuItem
                    v-if="currentContact"
                    :contact="currentContact"
                    is-active
                    @click="closeDrawer()"
                    @open-menu="openDeleteDialog(currentContact)"
                  />
                </div>
              </div>

              <DaisyMenuTitle class="relative">
                <span>showing {{ sidebarContacts.length }} of {{ total }} contacts </span>
                {{ isPending }}
                <i v-if="isPending" class="absolute right-0 h-6 w-6 icon-[svg-spinners--180-ring-with-bg]" />
              </DaisyMenuTitle>

              <div v-auto-animate="{ duration: 250 }">
                <template v-for="contact in sidebarContacts" :key="contact?._id">
                  <NuxtLink v-slot="{ navigate, isActive }" :to="`/app/contacts/${contact?._id}`" custom>
                    <ContactsMenuItem
                      :contact="contact"
                      :is-active="isActive"
                      @click="closeDrawer(); navigate();"
                      @open-menu="openDeleteDialog(contact)"
                    />
                  </NuxtLink>
                </template>
              </div>
            </div>

            <DaisyFlex col items-center class="pt-6">
              <DaisyButtonGroup>
                <DaisyButton sm :class="{ 'cursor-not-allowed bg-opacity-80 hover:bg-opacity-80': !canPrev }" @click="toStart">
                  <i class="icon-[feather--chevrons-left]" />
                </DaisyButton>
                <DaisyButton sm :class="{ 'cursor-not-allowed bg-opacity-80 hover:bg-opacity-80': !canPrev }" @click="prev">
                  <i class="icon-[feather--chevron-left]" />
                </DaisyButton>
                <DaisyButton sm>
                  Page {{ currentPage }} of {{ pageCount }}
                </DaisyButton>
                <DaisyButton sm :class="{ 'cursor-not-allowed bg-opacity-80 hover:bg-opacity-80': !canNext }" @click="next">
                  <i class="icon-[feather--chevron-right]" />
                </DaisyButton>
                <DaisyButton sm :class="{ 'cursor-not-allowed bg-opacity-80 hover:bg-opacity-80': !canNext }" @click="toEnd">
                  <i class="icon-[feather--chevrons-right]" />
                </DaisyButton>
              </DaisyButtonGroup>
            </DaisyFlex>
          </DaisyMenu>
        </DaisyFlex>
      </DaisyDrawer>
    </DaisyDrawerLayout>
  </DaisyFlex>
</template>
