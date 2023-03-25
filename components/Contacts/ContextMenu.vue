<script setup lang="ts">
defineEmits(['openMenu'])
</script>

<template>
  <DaisyDropdown end>
    <DaisyButton is="label" ghost sm circle class="-m-2" tabindex="0" @click.stop>
      <i class="icon-[feather--menu]" />
    </DaisyButton>
    <DaisyMenu tabindex="0" class="shadow dropdown-content bg-base-200 rounded-box">
      <DaisyMenuItem>
        <DaisyButton error class="w-32" @click.stop="$emit('openMenu')">
          <span>Delete</span>
          <i class="icon-[feather--trash-2]" />
        </DaisyButton>
      </DaisyMenuItem>
    </DaisyMenu>
  </DaisyDropdown>
</template>
