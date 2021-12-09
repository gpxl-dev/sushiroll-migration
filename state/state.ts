import BigNumber from "bignumber.js";
import { atom, atomFamily, selector } from "recoil";
import { TokenInfo } from "../constants/tokens";

export type TokenPair = [TokenInfo | null, TokenInfo | null];

export const selectedTabFamily = atomFamily<number, string>({
  key: "SelectedTab",
  default: 0,
});

export const selectedTokensInfoState = atom<TokenPair>({
  key: "selectedTokensInfo",
  default: [null, null],
});

export const orderedSelectedTokensInfoSelector = selector<TokenPair>({
  key: "orderedSelectedTokensInfo",
  get: ({ get }) => {
    const selectedTokensInfo = get(selectedTokensInfoState);
    const inverted = get(lpInvertedState);
    return inverted
      ? [selectedTokensInfo[1], selectedTokensInfo[0]]
      : selectedTokensInfo;
  },
});

export const noLPErrorState = atom<boolean>({
  key: "noLPError",
  default: false,
});

export const selectedTokensSelector = selector<[string | null, string | null]>({
  key: "selectedTokens",
  get: ({ get }) =>
    get(selectedTokensInfoState).map((t) => t?.address || null) as [
      string | null,
      string | null
    ],
});

export const userLPBalanceState = atom<BigNumber | null>({
  key: "userLPBalance",
  default: null,
});

export const lpTotalSupplyState = atom<BigNumber | null>({
  key: "lpTotalSupply",
  default: null,
});

// if token0 isn't selectedTokens[0]
export const lpInvertedState = atom<boolean>({
  key: "lpInverted",
  default: false,
});

export const lpReservesState = atom<[BigNumber, BigNumber] | null>({
  key: "lpReserves",
  default: null,
});

export const userSlippageToleranceState = atom<number>({
  key: "userSlippageTolerance",
  default: 0.02,
});

export const userLpShareSelector = selector<BigNumber | null>({
  key: "userLPShare",
  get: ({ get }) => {
    const userLPBalance = get(userLPBalanceState);
    const lpTotalSupply = get(lpTotalSupplyState);
    if (userLPBalance === null || lpTotalSupply === null) return null;
    if (userLPBalance.isEqualTo(0) || lpTotalSupply.isEqualTo(0))
      return new BigNumber(0);
    const userFraction = userLPBalance.dividedBy(lpTotalSupply);
    return userFraction;
  },
});

export const userTokensInLpSelector = selector<[BigNumber, BigNumber] | null>({
  key: "userTokensInLP",
  get: ({ get }) => {
    const userLPShare = get(userLpShareSelector);
    const lpReserves = get(lpReservesState);
    if (userLPShare === null || lpReserves === null) return null;
    if (userLPShare.isEqualTo(0)) return [new BigNumber(0), new BigNumber(0)];
    const userTokens = lpReserves.map((reserve) =>
      reserve.multipliedBy(userLPShare)
    ) as [BigNumber, BigNumber];
    return userTokens;
  },
});

export const fractionToRemoveState = atom<number>({
  key: "fractionToRemove",
  default: 1,
});

export const amountToMigrateSelector = selector<BigNumber | null>({
  key: "amountToMigrate",
  get: ({ get }) => {
    const fraction = get(fractionToRemoveState);
    const lpBalance = get(userLPBalanceState);
    if (lpBalance === null) return null;

    return lpBalance.multipliedBy(fraction).dp(0, BigNumber.ROUND_FLOOR);
  },
});

export const minimumAmountsSelector = selector<[BigNumber, BigNumber] | null>({
  key: "minimumAmounts",
  get: ({ get }) => {
    const lpReserves = get(lpReservesState);
    const userLpShare = get(userLpShareSelector);
    if (userLpShare === null || lpReserves === null) return null;
    const shareToRemove = userLpShare.multipliedBy(get(fractionToRemoveState));
    if (userLpShare.isEqualTo(0) || lpReserves[0].isEqualTo(0))
      return [new BigNumber(0), new BigNumber(0)];
    const slippage = get(userSlippageToleranceState);
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
    return [
      token0ReservesAfterPositiveSlippage.multipliedBy(shareToRemove),
      token1ReservesAfterNegativeSlippage.multipliedBy(shareToRemove),
    ];
  },
});

export const approvePendingState = atom<boolean>({
  key: "approvePending",
  default: false,
});

export const migratePendingState = atom<"approval" | "permit" | false>({
  key: "migratePending",
  default: false,
});

export const migrationCompleteState = atom<boolean>({
  key: "migrationComplete",
  default: false,
});
