import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "bignumber.js";
import { BigNumber as EthersBigNumber, constants, providers } from "ethers";
import React, { FC, useEffect } from "react";
import {
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
import ErrorOverlay from "../ErrorOverlay/ErrorOverlay";
import FormattedBigNumberUnits from "../Numbers/FormattedBigNumberUnits";

const UniswapLiquidityPosition: FC<{}> = ({}) => {
  // Selected tokens
  const tokens = useRecoilValue(selectedTokensSelector);
  const tokenInfo = useRecoilValue(orderedSelectedTokensInfoSelector);
  const twoTokensSelected = tokens.filter((t) => t !== null).length === 2;

  // Contract
  const pair = useUniswapPair(tokens[0], tokens[1]);

  // Connected wallet
  const { account } = useWeb3React<providers.Web3Provider>();

  // Error states
  const noLP = useRecoilValue(noLPErrorState);

  // Fetched and calculated data
  const [lpBalance, setLpBalance] = useRecoilState(userLPBalanceState);
  const resetLpBalance = useResetRecoilState(userLPBalanceState);

  const setLpReserves = useSetRecoilState(lpReservesState);
  const resetLpReserves = useResetRecoilState(lpReservesState);

  const setLpTotalSupply = useSetRecoilState(lpTotalSupplyState);
  const resetLpTotalSupply = useResetRecoilState(lpTotalSupplyState);

  const setInverted = useSetRecoilState(lpInvertedState);
  const minTokens = useRecoilValue(minimumAmountsSelector);
  const userTokensInLp = useRecoilValue(userTokensInLpSelector);

  // User configured data
  const [slippageTolerance, setSlippageTolerance] = useRecoilState(
    userSlippageToleranceState
  );
  const [fractionToRemove, setFractionToRemove] = useRecoilState(
    fractionToRemoveState
  );

  // This effect fetches data about liquidity from the pair and sets recoil
  // states that will enable selectors to calculate liquidity position info
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
      <span className="table-label">LP Balance</span>
      <FormattedBigNumberUnits value={lpBalance} decimals={18} />
      <span className="table-label">{tokenInfo[0]?.symbol} in LP</span>
      <FormattedBigNumberUnits
        value={userTokensInLp?.[0] || null}
        decimals={tokenInfo[1]?.decimals || 18}
      />
      <span className="table-label">{tokenInfo[1]?.symbol} in LP</span>
      <FormattedBigNumberUnits
        value={userTokensInLp?.[1] || null}
        decimals={tokenInfo[1]?.decimals || 18}
      />
      <span className="table-label">Slippage tolerance</span>
      <div className="flex flex-row gap-2 ml-2">
        <button
          className="small-round-button"
          onClick={() => {
            setSlippageTolerance((prev) => Math.max(0, prev - 0.005));
          }}
        >
          <span className="relative -top-px">-</span>
        </button>
        <span>{(slippageTolerance * 100).toFixed(1)}%</span>
        <button
          className="small-round-button"
          onClick={() => {
            setSlippageTolerance((prev) => Math.min(1, prev + 0.005));
          }}
        >
          <span className="relative left-px">+</span>
        </button>
      </div>
      <span className="table-label">Amount of liquidity to migrate</span>
      <div className="flex flex-row gap-2 ml-2">
        <button
          className="small-round-button"
          onClick={() => {
            setFractionToRemove((prev) => Math.max(0, prev - 0.05));
          }}
        >
          <span className="relative -top-px">-</span>
        </button>
        <span>{(fractionToRemove * 100).toFixed(0)}%</span>
        <button
          className="small-round-button"
          onClick={() => {
            setFractionToRemove((prev) => Math.min(1, prev + 0.05));
          }}
        >
          <span className="relative left-px">+</span>
        </button>
      </div>
      <span className="table-label">
        Minimum {tokenInfo[0]?.symbol} removed
      </span>
      <FormattedBigNumberUnits
        value={minTokens?.[0] || null}
        decimals={tokenInfo[0]?.decimals || 18}
      />
      <span className="table-label">
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
