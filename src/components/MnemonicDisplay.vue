<template>
  <div
    class="w-40 border rounded-full border-rGray leading-tight h-16 justify-center inline-flex items-center"
  >
    <div :class="{ 'filter-blur': obfuscate }">
      {{ word }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const MnemonicDisplay = defineComponent({
  props: {
    obfuscate: {
      type: Boolean,
      required: true
    },
    word: {
      type: String,
      required: false
    }
  }
})

export default MnemonicDisplay
</script>
