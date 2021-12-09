import { BigNumber } from "bignumber.js";
import { BigNumber as EthersBigNumber, constants } from "ethers";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import React, { FC, useEffect, useState } from "react";
import {
  DefaultValue,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import useUniswapPair from "../../hooks/useUniswapPair";
import {
  fractionToRemoveState,
  lpInvertedState,
  lpReservesState,
  lpTotalSupplyState,
  minimumAmountsSelector,
  noLPErrorState,
  orderedSelectedTokensInfoSelector,
  selectedTokensSelector,
  userLPBalanceState,
  userSlippageToleranceState,
  userTokensInLpSelector,
} from "../../state/state";
import FormattedBigNumberUnits from "../Numbers/FormattedBigNumberUnits";
import ErrorOverlay from "../ErrorOverlay/ErrorOverlay";

const UniswapLiquidityPosition: FC<{}> = ({}) => {
  const tokens = useRecoilValue(selectedTokensSelector);
  const twoTokensSelected = tokens.filter((t) => t !== null).length === 2;
  const pair = useUniswapPair(tokens[0], tokens[1]);
  const { account } = useWeb3React<providers.Web3Provider>();

  const noLP = useRecoilValue(noLPErrorState);
  const [lpBalance, setLpBalance] = useRecoilState(userLPBalanceState);
  const resetLpBalance = useResetRecoilState(userLPBalanceState);
  const setLpReserves = useSetRecoilState(lpReservesState);
  const resetLpReserves = useResetRecoilState(lpReservesState);
  const setLpTotalSupply = useSetRecoilState(lpTotalSupplyState);
  const resetLpTotalSupply = useResetRecoilState(lpTotalSupplyState);
  const setInverted = useSetRecoilState(lpInvertedState);
  const [slippageTolerance, setSlippageTolerance] = useRecoilState(
    userSlippageToleranceState
  );
  const [fractionToRemove, setFractionToRemove] = useRecoilState(
    fractionToRemoveState
  );
  const minTokens = useRecoilValue(minimumAmountsSelector);

  const userTokensInLp = useRecoilValue(userTokensInLpSelector);
  const tokenInfo = useRecoilValue(orderedSelectedTokensInfoSelector);

  useEffect(() => {
    if (!pair || !account || noLP) {
      resetLpBalance();
      return;
    } else {
      resetLpBalance();
      if (pair.address === constants.AddressZero) {
        return;
      }
      pair.balanceOf(account).then((balance: EthersBigNumber) => {
        setLpBalance(new BigNumber(balance.toString()));
      });

      pair.token0().then((addr: string) => {
        setInverted(addr !== tokens[0]);
      });

      resetLpReserves();
      pair
        .getReserves()
        .then((reserves: [EthersBigNumber, EthersBigNumber]) => {
          setLpReserves(
            reserves.map((r) => new BigNumber(r.toString())) as [
              BigNumber,
              BigNumber
            ]
          );
        });

      resetLpTotalSupply();
      pair.totalSupply().then((supply: EthersBigNumber) => {
        setLpTotalSupply(new BigNumber(supply.toString()));
      });
    }
  }, [
    pair,
    account,
    setLpBalance,
    setLpReserves,
    setLpTotalSupply,
    resetLpBalance,
    resetLpReserves,
    resetLpTotalSupply,
    noLP,
    twoTokensSelected,
    setInverted,
    tokens,
  ]);

  return (
    <div className="relative grid grid-cols-2 gap-x-4 gap-y-2">
      <ErrorOverlay
        header={"This doesn't seem right..."}
        paragraphs={[
          "The token pair you have selected has no liquidity pool on Uniswap",
          "Please check your selection and try again",
        ]}
        show={noLP}
      />
      <ErrorOverlay
        header={"Please select two tokens"}
        paragraphs={[
          "Before we can check your liquidity position you will need to select tow tokens from the previous tab",
        ]}
        show={!twoTokensSelected}
      />
      <span className="font-extrabold underline text-right text-sm self-end">
        LP Balance
      </span>
      <FormattedBigNumberUnits value={lpBalance} decimals={18} />
      <span className="font-extrabold underline text-right text-sm self-end">
        {tokenInfo[0]?.symbol} in LP
      </span>
      <FormattedBigNumberUnits
        value={userTokensInLp?.[0] || null}
        decimals={tokenInfo[1]?.decimals || 18}
      />
      <span className="font-extrabold underline text-right text-sm self-end">
        {tokenInfo[1]?.symbol} in LP
      </span>
      <FormattedBigNumberUnits
        value={userTokensInLp?.[1] || null}
        decimals={tokenInfo[1]?.decimals || 18}
      />
      <span className="font-extrabold underline text-right text-sm self-end">
        Slippage tolerance
      </span>
      <div className="flex flex-row gap-2">
        <button
          className="rounded-full border border-black w-4 h-4 flex items-center justify-center self-center"
          onClick={() => {
            setSlippageTolerance((prev) => Math.max(0, prev - 0.005));
          }}
        >
          <span className="relative -top-px">-</span>
        </button>
        <span>{(slippageTolerance * 100).toFixed(1)}%</span>
        <button
          className="rounded-full border border-black w-4 h-4 flex items-center justify-center self-center"
          onClick={() => {
            setSlippageTolerance((prev) => Math.min(1, prev + 0.005));
          }}
        >
          <span className="relative left-px">+</span>
        </button>
      </div>
      <span className="font-extrabold underline text-right text-sm self-end">
        Amount of liquidity to migrate
      </span>
      <div className="flex flex-row gap-2">
        <button
          className="rounded-full border border-black w-4 h-4 flex items-center justify-center self-center"
          onClick={() => {
            setFractionToRemove((prev) => Math.max(0, prev - 0.05));
          }}
        >
          <span className="relative -top-px">-</span>
        </button>
        <span>{(fractionToRemove * 100).toFixed(0)}%</span>
        <button
          className="rounded-full border border-black w-4 h-4 flex items-center justify-center self-center"
          onClick={() => {
            setFractionToRemove((prev) => Math.min(1, prev + 0.05));
          }}
        >
          <span className="relative left-px">+</span>
        </button>
      </div>
      <span className="font-extrabold underline text-right text-sm self-end">
        Minimum {tokenInfo[0]?.symbol} removed
      </span>
      <FormattedBigNumberUnits
        value={minTokens?.[0] || null}
        decimals={tokenInfo[0]?.decimals || 18}
      />
      <span className="font-extrabold underline text-right text-sm self-end">
        Minimum {tokenInfo[1]?.symbol} removed
      </span>
      <FormattedBigNumberUnits
        value={minTokens?.[1] || null}
        decimals={tokenInfo[1]?.decimals || 18}
      />
    </div>
  );
};

export default UniswapLiquidityPosition;
