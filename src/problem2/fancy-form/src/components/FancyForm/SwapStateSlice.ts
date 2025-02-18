import Decimal from 'decimal.js';
import { TypeToken } from 'services/TokenServices/entities';
import { create } from 'zustand';

interface SwapState {
  listTokens: TypeToken[];
  sellingAmount: number | undefined;
  buyingAmount: number | undefined;
  selectedValueSellToken: TypeToken;
  selectedValueBuyToken: TypeToken;

  setListTokens: (tokens: TypeToken[]) => void;
  setSellingAmount: (amount: number) => void;
  setBuyingAmount: (amount: number) => void;
  setSelectedValueSellToken: (currency: string) => void;
  setSelectedValueBuyToken: (currency: string) => void;

  listOptionTokens: () => TypeToken[];
  calSellingUSD: () => number;
  calBuyingUSD: () => number;
  calExchangeRate: (isRevert?: boolean) => number;
  calPriceImpact: () => number;
  calFeeBuyAmount: () => number;

  toggleSwapToken: () => void;
}

const useSwapStore = create<SwapState>((set, get) => ({
  listTokens: [],
  sellingAmount: undefined,
  buyingAmount: undefined,
  selectedValueSellToken: { currency: '', date: '', price: 0 },
  selectedValueBuyToken: { currency: '', date: '', price: 0 },

  setListTokens: (tokens) => set({ listTokens: tokens }),
  setSellingAmount: (amount) => set({ sellingAmount: amount }),
  setBuyingAmount: (amount) => set({ buyingAmount: amount }),
  setSelectedValueSellToken: (currency) => {
    const { listTokens } = get();
    const founded = listTokens.find((item) => item.currency === currency);
    if (founded) {
      set({ selectedValueSellToken: founded });
    }
  },
  setSelectedValueBuyToken: (currency) => {
    const { listTokens } = get();
    const founded = listTokens.find((item) => item.currency === currency);
    if (founded) {
      set({ selectedValueBuyToken: founded });
    }
  },

  listOptionTokens: () => {
    const { listTokens, selectedValueSellToken, selectedValueBuyToken } = get();
    return listTokens.map((item) => ({
      ...item,
      isDisabled:
        item.currency === selectedValueSellToken.currency ||
        item.currency === selectedValueBuyToken.currency
    }));
  },

  calSellingUSD: () => {
    const { selectedValueSellToken, sellingAmount } = get();
    return selectedValueSellToken.currency !== '' && sellingAmount
      ? new Decimal(selectedValueSellToken.price)
          .times(sellingAmount)
          .toNumber()
      : 0;
  },

  calBuyingUSD: () => {
    const { selectedValueBuyToken, buyingAmount } = get();
    return selectedValueBuyToken.currency !== '' && buyingAmount
      ? new Decimal(selectedValueBuyToken.price).times(buyingAmount).toNumber()
      : 0;
  },

  calExchangeRate: (isRevert = false) => {
    const { selectedValueSellToken, selectedValueBuyToken } = get();
    const rate = isRevert
      ? new Decimal(selectedValueBuyToken.price)
          .div(selectedValueSellToken.price)
          .toNumber()
      : new Decimal(selectedValueSellToken.price)
          .div(selectedValueBuyToken.price)
          .toNumber();
    return !Number.isNaN(rate) && Number.isFinite(rate) ? rate : 0;
  },

  calPriceImpact: () => {
    const { selectedValueBuyToken, buyingAmount, sellingAmount } = get();
    if (sellingAmount && buyingAmount) {
      const executedPrice = new Decimal(sellingAmount).div(buyingAmount);

      const priceImpact = new Decimal(selectedValueBuyToken.price)
        .minus(executedPrice.toNumber())
        .div(selectedValueBuyToken.price)
        .times(100)
        .toNumber()
        .toFixed(5) as unknown as number;

      return priceImpact;
    }
    return 0;
  },

  calFeeBuyAmount: () => {
    const { calBuyingUSD } = get();
    return new Decimal(calBuyingUSD()).times(0.002).toNumber();
  },

  toggleSwapToken: () => {
    const {
      sellingAmount,
      buyingAmount,
      selectedValueSellToken,
      selectedValueBuyToken
    } = get();

    set({
      sellingAmount: buyingAmount,
      buyingAmount: sellingAmount,
      selectedValueSellToken: selectedValueBuyToken,
      selectedValueBuyToken: selectedValueSellToken
    });
  }
}));

export default useSwapStore;
