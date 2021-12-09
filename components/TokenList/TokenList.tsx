import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import Image from "next/image";
import React, { FC, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import allTokens, { TokenInfo } from "../../constants/tokens";
import {
  noLPErrorState,
  selectedTokensInfoState,
  selectedTokensSelector,
  TokenPair,
} from "../../state/state";

const TokenList: FC<{}> = ({}) => {
  const { chainId } = useWeb3React();
  const [firstTokenWasLastSet, setFirstTokenWasLastSet] =
    useState<boolean>(false);
  const selectedTokens = useRecoilValue(selectedTokensSelector);
  const setSelectedTokens = useSetRecoilState(selectedTokensInfoState);
  const setNoLp = useSetRecoilState(noLPErrorState);

  const onTokenClick = (
    token: TokenInfo,
    isSelected: boolean,
    numSelected: number
  ) => {
    // Clear the "No liquidity pair" error state if tokens are changed to ensure
    // we re-attempt fetching the pair contract.
    setNoLp(false);

    setSelectedTokens((prev) => {
      // if already selected, deselect.
      if (isSelected)
        return prev.map((t) =>
          t?.address === token.address ? null : t
        ) as TokenPair;

      // If there's a gap, fill it left to right.
      if (!numSelected) return [token, null];

      if (numSelected === 1) {
        setFirstTokenWasLastSet(prev[0] === null);
        return prev.map((t) => (t === null ? token : t)) as TokenPair;
      }

      // Two other tokens are selected, replace the one we set longest ago for
      // the most natural experience, and make a note of which token we set last
      if (!firstTokenWasLastSet) {
        setFirstTokenWasLastSet(true);
        return [token, prev[1]];
      } else {
        setFirstTokenWasLastSet(false);
        return [prev[0], token];
      }
    });
  };

  const tokens = allTokens[chainId || 1];

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-x-12 gap-y-2 self-center">
        {tokens.map((token) => {
          const isSelected = selectedTokens.some((t) => t === token.address);
          const numSelected = selectedTokens.reduce(
            (count, t) => (t === null ? count : count + 1),
            0
          );
          return (
            <button
              className={classNames(
                "relative group",
                "flex flex-row items-center text-left p-3 gap-4",
                "border-0 border-black"
              )}
              key={token.address}
              onClick={() => onTokenClick(token, isSelected, numSelected)}
            >
              <span
                className={classNames(
                  "w-9 h-9",
                  "border border-black rounded-full drop-shadow-hard",
                  "grayscale-[60%]"
                )}
              >
                <Image
                  src={token.logoURI}
                  alt={`${token.name} logo`}
                  width={36}
                  height={36}
                />
              </span>
              <div className="flex flex-col">
                <h5 className="font-mono text-xs">{token.name}</h5>
                <h4 className="-mb-1">{token.symbol}</h4>
              </div>
              <div
                className={classNames(
                  "absolute inset-0 border-2 border-black",
                  "transition-all opacity-0 skew-x-0 duration-300 ease-in-out",
                  "hover:opacity-20 hover:-skew-x-12",
                  {
                    "!opacity-100 !-skew-x-12": isSelected,
                  }
                )}
              ></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TokenList;
