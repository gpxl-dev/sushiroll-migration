import { BigNumber } from "bignumber.js";
import { BigNumber as EthersBigNumber } from "ethers";
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
  lpReservesState,
  lpTotalSupplyState,
  minimumAmountsSelector,
  selectedTokensInfo,
  selectedTokensState,
  userLPBalanceState,
  userSlippageToleranceState,
  userTokensInLpSelector,
} from "../../state/state";

const UniswapLiquidityPosition: FC<{}> = ({}) => {
  const tokens = useRecoilValue(selectedTokensState);
  const pair = useUniswapPair(tokens[0], tokens[1]);
  const { account } = useWeb3React<providers.Web3Provider>();

  const [lpBalance, setLpBalance] = useRecoilState(userLPBalanceState);
  const resetLpBalance = useResetRecoilState(userLPBalanceState);
  const setLpReserves = useSetRecoilState(lpReservesState);
  const resetLpReserves = useResetRecoilState(lpReservesState);
  const setLpTotalSupply = useSetRecoilState(lpTotalSupplyState);
  const resetLpTotalSupply = useResetRecoilState(lpTotalSupplyState);
  const slippageTolerance = useRecoilValue(userSlippageToleranceState);
  const minTokens = useRecoilValue(minimumAmountsSelector);

  const userTokensInLp = useRecoilValue(userTokensInLpSelector);
  const tokenInfo = useRecoilValue(selectedTokensInfo);

  useEffect(() => {
    if (!pair || !account) {
      resetLpBalance();
      return;
    } else {
      // TODO: check approval status and show approve button
      resetLpBalance();
      pair.balanceOf(account).then((balance: EthersBigNumber) => {
        setLpBalance(new BigNumber(balance.toString()));
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
  ]);

  return (
    // TODO: Decimal values should be floored.
    <div className="grid grid-cols-2">
      <span className="font-bold">My LP Tokens</span>
      <span>{formatUnits(lpBalance.toFixed(0))}</span>
      <span className="font-bold">my {tokenInfo[0]?.symbol} in lp</span>
      <span>
        {formatUnits(userTokensInLp[0].toFixed(0), tokenInfo[0]?.decimals)}
      </span>
      <span className="font-bold">my {tokenInfo[1]?.symbol} in lp</span>
      <span>
        {formatUnits(userTokensInLp[1].toFixed(0), tokenInfo[1]?.decimals)}
      </span>
      <span className="font-bold">slippage tolerance</span>
      <span>{slippageTolerance * 100}%</span>
      <span className="font-bold">Min {tokenInfo[0]?.symbol}</span>
      <span>
        {formatUnits(minTokens[0].toFixed(0), tokenInfo[0]?.decimals)}
      </span>
      <span className="font-bold">Min {tokenInfo[1]?.symbol}</span>
      <span>
        {formatUnits(minTokens[1].toFixed(0), tokenInfo[1]?.decimals)}
      </span>
    </div>
  );
};

export default UniswapLiquidityPosition;
