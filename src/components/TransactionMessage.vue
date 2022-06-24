<template>
  <div>
    <button v-if="state === 'encrypted'" class="text-rGreen underline hover:text-rGreenDark transition-colors" @click="emit()">{{ $t('history.clickToDecryptLabel') }}</button>
    <span v-if="state === 'decrypted'" class="text-rDarkBlue wrap-anywhere">{{ decryptedMessage }}</span>
    <span v-if="state === 'plaintext'" class="text-rDarkBlue wrap-anywhere">{{decodedMessage}}</span>
  </div>
</template>

<style>
.wrap-anywhere {
  overflow-wrap: anywhere
}
</style>

<script lang="ts">
import { defineComponent, toRef, ref, PropType, computed } from 'vue'
import { decodeMessage, isEncrypted } from '@/helpers/message'
export default defineComponent({
  props: {
    message: {
      type: String,
      required: true
    },
    decryptedMessage: {
      type: String as PropType<string>,
      required: false,
      default: null
    }
  },
  setup (props, context) {
    const message = toRef(props, 'message')
    const encrypted = ref(false)
    const decodedMessage = ref('')
    const decryptedMessage = toRef(props, 'decryptedMessage')
    if (isEncrypted(message.value)) {
      encrypted.value = true
    }
    const msg = decodeMessage(message.value)
    if (msg) {
      decodedMessage.value = msg
    }
    const state = computed(() => {
      if (decryptedMessage.value) return 'decrypted'
      if (encrypted.value) return 'encrypted'
      return 'plaintext'
    })
    const emit = () => {
      context.emit('decrypt')
    }
    return {
      encrypted,
      decodedMessage,
      state,
      emit
    }
  },
  methods: {

  },
  emits: ['decrypt']
})
</script>
