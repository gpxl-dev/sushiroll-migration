import BigNumber from "bignumber.js";
import { atom, atomFamily, selector } from "recoil";
import { TokenInfo } from "../constants/tokens";

export type TokenPair = [TokenInfo | null, TokenInfo | null];

export const selectedTabFamily = atomFamily<number, string>({
  key: "SelectedTab",
  default: 0,
});

export const selectedTokensInfo = atom<TokenPair>({
  key: "selectedTokensInfo",
  default: [null, null],
});

export const selectedTokensSelector = selector<[string | null, string | null]>({
  key: "selectedTokens",
  get: ({ get }) =>
    get(selectedTokensInfo).map((t) => t?.address || null) as [
      string | null,
      string | null
    ],
});

export const userLPBalanceState = atom<BigNumber>({
  key: "userLPBalance",
  default: new BigNumber(0),
});

export const lpTotalSupplyState = atom<BigNumber>({
  key: "lpTotalSupply",
  default: new BigNumber(0),
});

// if token0 isn't selectedTokens[0]
export const lpIsInvertedSelector = selector<boolean>({
  key: "lpIsInverted",
  get: ({ get }) => {
    const [token0, token1] = get(selectedTokensSelector);
    return new BigNumber(token0 || 0).isGreaterThanOrEqualTo(token1 || 0);
  },
});

export const lpReservesState = atom<[BigNumber, BigNumber]>({
  key: "lpReserves",
  default: [new BigNumber(0), new BigNumber(0)],
});

export const userSlippageToleranceState = atom<number>({
  key: "userSlippageTolerance",
  default: 0.02,
});

export const userLpShareSelector = selector<BigNumber>({
  key: "userLPShare",
  get: ({ get }) => {
    const userLPBalance = get(userLPBalanceState);
    const lpTotalSupply = get(lpTotalSupplyState);
    if (userLPBalance.isEqualTo(0) || lpTotalSupply.isEqualTo(0))
      return new BigNumber(0);
    const userFraction = userLPBalance.dividedBy(lpTotalSupply);
    return userFraction;
  },
});

export const userTokensInLpSelector = selector<[BigNumber, BigNumber]>({
  key: "userTokensInLP",
  get: ({ get }) => {
    const userLPShare = get(userLpShareSelector);
    if (userLPShare.isEqualTo(0)) return [new BigNumber(0), new BigNumber(0)];
    const lpIsInverted = get(lpIsInvertedSelector);
    const lpReserves = get(lpReservesState);
    const userTokens = lpReserves.map((reserve) =>
      reserve.multipliedBy(userLPShare)
    ) as [BigNumber, BigNumber];
    return lpIsInverted ? [userTokens[1], userTokens[0]] : userTokens;
  },
});

export const fractionToRemoveState = atom<number>({
  key: "fractionToRemove",
  default: 1,
});

export const minimumAmountsSelector = selector<[BigNumber, BigNumber]>({
  key: "minimumAmounts",
  get: ({ get }) => {
    const lpReserves = get(lpReservesState);
    const userLpShare = get(userLpShareSelector);
    const shareToRemove = userLpShare.multipliedBy(get(fractionToRemoveState));
    if (userLpShare.isEqualTo(0) || lpReserves[0].isEqualTo(0))
      return [new BigNumber(0), new BigNumber(0)];
    const slippage = get(userSlippageToleranceState);
    const invert = get(lpIsInvertedSelector);
    // this is price of token 0
    const token0PricePreSlippage = lpReserves[1].dividedBy(lpReserves[0]);
    const token0PriceAfterPositiveSlippage =
      token0PricePreSlippage.multipliedBy(1 + slippage);
    const token0PriceAfterNegativeSlippage =
      token0PricePreSlippage.multipliedBy(1 - slippage);
    const lpInvariant = lpReserves[0].multipliedBy(lpReserves[1]);
    // positive slippage increases the value of reserves[0] thus reducing the
    // number in the LP and giving us minimum for token 0
    const token0ReservesAfterPositiveSlippage = lpInvariant
      .dividedBy(token0PriceAfterPositiveSlippage)
      .squareRoot();
    const token0ReservesAfterNegativeSlippage = lpInvariant
      .dividedBy(token0PriceAfterNegativeSlippage)
      .squareRoot();
    // Following from above, negative slippage gives minimum for token 1
    const token1ReservesAfterNegativeSlippage = lpInvariant.dividedBy(
      token0ReservesAfterNegativeSlippage
    );
    return invert
      ? [
          token1ReservesAfterNegativeSlippage.multipliedBy(shareToRemove),
          token0ReservesAfterPositiveSlippage.multipliedBy(shareToRemove),
        ]
      : [
          token0ReservesAfterPositiveSlippage.multipliedBy(shareToRemove),
          token1ReservesAfterNegativeSlippage.multipliedBy(shareToRemove),
        ];
  },
});
