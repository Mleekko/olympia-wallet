<template>
  <div class="fixed w-screen h-screen z-20 flex items-center justify-center bg-translucent-black left-0 top-0">
    <div
      class="h-modalSmall bg-white rounded-md py-7 px-7 w-full max-w-lg absolute top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-1/2">
      <div class="text-center">
        <h3 class="font-medium text-rBlack mb-2 w-full">Choose Hardware Wallet Account</h3>
        <br>
        <div class="border border-rGray bg-white rounded-md flex flex-row mb-2 overflow-y-auto">
          <div class="text-rBlack flex flex-col my-3 mt-5 px-5 border-rGray flex-2">
            Please choose account to connect.
          </div>
          <select
            class="border-0 py-2 border-rBlack focus:ring-0 focus:outline-none focus:border-rGreen text-rBlack flex flex-col my-3 mx-5 px-5 border-rGray flex-1 rounded-md border"
            v-model="accountIdx"
          >
            <option
              v-for="idx in Array.from(Array(10).keys())"
              :key="idx"
              :value="idx"
            >
              {{ idx }}
            </option>
          </select>
        </div>
        <div class="text-center pt-4">
          <ButtonSubmit @click="$emit('hardwareWalletConfirmed', accountIdx)" class="w-72 mx-auto mt-2" :disabled=false>
            Confirm
          </ButtonSubmit>
          <button @click="$emit('closeLedgerChooseAccountModal')" class="block m-auto py-4"> Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ButtonSubmit from '@/components/ButtonSubmit.vue'

const WalletLedgerChooseAccountModal = defineComponent({
  components: {
    ButtonSubmit
  },

  props: {},

  setup () {
    const accountIdx = 0
    return { accountIdx }
  },

  computed: {},

  methods: {},

  emits: ['hardwareWalletConfirmed', 'closeLedgerChooseAccountModal']
})

export default WalletLedgerChooseAccountModal
</script>
