<template>
  <div class="flex flex-col flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-white">
    <div class="bg-rGrayLightest px-8">
      <div class="flex justify-between mb-4 pt-4">
        <h3 class="font-medium text-rBlack">{{ $t('wallet.balancesHeading') }}</h3>
        <div class="flex items-center text-rBlack text-sm">
          <span class="text-rGrayDark mr-2">{{ $t('wallet.currentAddress') }}</span> <span class="font-mono text-rBlack">{{ activeAddress.toString() }}</span>
          <div class="hover:text-rGreen flex flex-row items-center cursor-pointer transition-colors">
            <click-to-copy
              :address="activeAddress.toString()"
              :checkForHardwareAddress=true
              @verifyHardwareAddress="$emit('verifyHardwareAddress')"
            />
          </div>
        </div>
      </div>

      <div class="border border-rGray bg-white rounded-md flex flex-row mb-7 overflow-y-auto">
        <img src="@/assets/token.svg" alt="token symbol" class="p-3 border-r border-rGray" />
        <div class="flex flex-col my-3 px-5 border-r border-rGray flex-1">
          <span class="text-sm text-rGrayDark">{{ $t('wallet.totalTokens') }}</span>
          <div class="flex flex-row items-end">
            <big-amount :amount="availablePlusStakedAndUnstakedXRD" class="text-2xl font-light mr-4 text-rGreen" />
            <token-symbol>{{ nativeToken.symbol }}</token-symbol>
          </div>
        </div>
        <div class="flex flex-col my-3 px-5 border-r border-rGray flex-1">
          <span class="text-sm text-rGrayDark">{{ $t('wallet.availableTokens') }}</span>
          <div class="flex flex-row items-end">
            <big-amount :amount="totalXRD" class="text-2xl font-light mr-4 text-rBlack" />
            <token-symbol>{{ nativeToken.symbol }}</token-symbol>
          </div>
        </div>
        <div class="flex flex-col my-3 px-5 flex-1">
          <span class="text-sm text-rGrayDark">{{ $t('wallet.stakedTokens') }}</span>
          <div class="flex flex-row items-end">
            <big-amount :amount="totalStakedAndUnstaked" class="text-2xl font-light mr-4 text-rBlack" />
            <token-symbol>{{ nativeToken.symbol }}</token-symbol>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white text-rBlack py-4 px-8 flex-1">
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(tokenBalance, i) in otherTokenBalances"
          :key="i"
          class="border border-rGray rounded-md divide-x divide-rGray"
        >
          <div class="flex flex-row py-1">
            <div class="flex-1 flex flex-row items-center px-6 py-7 overflow-x-auto">
              <big-amount :amount="tokenBalance.amount" class="text-2xl font-light mr-4 text-rBlack" />
              <token-symbol>{{ tokenBalance.token.symbol.toUpperCase() }}</token-symbol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref } from 'vue'
import { StakePosition, Token, TokenBalance, TokenBalances, AccountAddressT, Amount, AmountT, UnstakePosition } from '@radixdlt/application'
import BigAmount from '@/components/BigAmount.vue'
import TokenSymbol from '@/components/TokenSymbol.vue'
import ClickToCopy from '@/components/ClickToCopy.vue'
import { ref } from '@nopr3d/vue-next-rx'
import { sumAmounts, subtract, add } from '@/helpers/arithmetic'

const WalletOverview = defineComponent({
  components: {
    BigAmount,
    TokenSymbol,
    ClickToCopy
  },

  props: {
    tokenBalances: {
      type: Object as PropType<TokenBalances>,
      required: true
    },
    activeAddress: {
      type: Object as PropType<AccountAddressT>,
      required: true
    },
    activeStakes: {
      type: Array as PropType<Array<StakePosition>>,
      required: true
    },
    activeUnstakes: {
      type: Array as PropType<Array<UnstakePosition>>,
      required: true
    },
    nativeToken: {
      type: Object as PropType<Token>,
      required: true
    },
    nativeTokenBalance: {
      type: Object as PropType<TokenBalance>,
      required: false
    }
  },

  computed: {
    totalXRD (): AmountT {
      if (!this.nativeTokenBalance) return Amount.fromUnsafe(0)._unsafeUnwrap()
      const xrdAmount = Amount.fromUnsafe(this.nativeTokenBalance.amount)
      return xrdAmount.isErr() ? Amount.fromUnsafe(0)._unsafeUnwrap() : xrdAmount.value
    },
    totalStakedAndUnstaked (): AmountT {
      const totalStakedAndUnstaked = sumAmounts(this.activeStakes.flatMap((item: StakePosition) => item.amount)) || Amount.fromUnsafe(0)._unsafeUnwrap()
      const totalUnstaked = sumAmounts(this.activeUnstakes.flatMap((item: StakePosition) => item.amount)) || Amount.fromUnsafe(0)._unsafeUnwrap()
      return sumAmounts([totalStakedAndUnstaked, totalUnstaked]) || Amount.fromUnsafe(0)._unsafeUnwrap()
    },
    availablePlusStakedAndUnstakedXRD (): AmountT {
      const totalXRD: AmountT = this.totalXRD || Amount.fromUnsafe(0)._unsafeUnwrap()
      const totalStakedAndUnstaked: AmountT = this.totalStakedAndUnstaked || Amount.fromUnsafe(0)._unsafeUnwrap()
      return add(totalXRD, totalStakedAndUnstaked)
    },
    otherTokenBalances (): TokenBalance[] {
      if (!this.nativeToken || !this.tokenBalances.tokenBalances) return []
      else return this.tokenBalances.tokenBalances.filter((tb: TokenBalance) => !tb.token.rri.equals(this.nativeToken.rri))
    }
  },

  emits: ['verifyHardwareAddress']
})

export default WalletOverview
</script>
