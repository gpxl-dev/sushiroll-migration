import { useWeb3React } from "@web3-react/core";
import React, { FC, useCallback, useEffect, useState } from "react";
import { BigNumber as EthersBigNumber, providers } from "ethers";
import { useRecoilValue } from "recoil";
import useSushiRoll from "../../hooks/useSushiRoll";
import useUniswapPair from "../../hooks/useUniswapPair";
import {
  minimumAmountsSelector,
  selectedTokensSelector,
  userLPBalanceState,
} from "../../state/state";
import BigNumber from "bignumber.js";
import { splitSignature } from "@ethersproject/bytes";

const UNISWAP_DOMAIN_INFO = {
  version: "1",
  name: "Uniswap V2",
};

const EIP2612_PERMIT_TYPE = [
  { name: "owner", type: "address" },
  { name: "spender", type: "address" },
  { name: "value", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
];

const EIP712_DOMAIN_TYPE = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const getPermitTypedData: (
  domainParams: {
    chainId: number;
    verifyingContract: string;
  },
  messageParams: {
    owner: string;
    spender: string;
    value: string;
    nonce: string;
    deadline: string;
  }
) => any = (domainParams, messageParams) => {
  const typedData = {
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPE,
      Permit: EIP2612_PERMIT_TYPE,
    },
    primaryType: "Permit",
    domain: {
      ...UNISWAP_DOMAIN_INFO,
      ...domainParams,
    },
    message: messageParams,
  };
  return typedData;
};

const MigrateUniswap: FC<{}> = ({}) => {
  const { account, chainId, library } = useWeb3React<providers.Web3Provider>();
  const tokens = useRecoilValue(selectedTokensSelector);
  const pair = useUniswapPair(tokens[0], tokens[1]);
  const sushiRoll = useSushiRoll();
  // TODO:
  const migrateFraction = 1;
  const minimumAmouts = useRecoilValue(minimumAmountsSelector);
  const amountToMigrate = useRecoilValue(userLPBalanceState);

  const [hasApproval, setHasApproval] = useState<boolean>(false);

  useEffect(() => {
    if (!pair || !sushiRoll) return;
    pair
      .allowance(account, sushiRoll.address)
      .then((allowance: EthersBigNumber) => {
        setHasApproval(
          new BigNumber(allowance.toString()).isGreaterThanOrEqualTo(
            amountToMigrate
          )
        );
      });
  }, [pair, account, amountToMigrate, sushiRoll]);

  const migrateWithPermit = useCallback(async () => {
    if (!pair || !chainId || !sushiRoll) {
      return;
    }

    const signer = library!.getSigner();
    const currentNonce = await pair.nonces(account);
    const deadline = (Math.floor(Date.now() / 1000) + 10 * 60).toString();

    const signature = await signer._signTypedData(
      { ...UNISWAP_DOMAIN_INFO, chainId, verifyingContract: pair.address },
      {
        Permit: EIP2612_PERMIT_TYPE,
      },
      {
        deadline,
        nonce: currentNonce,
        owner: account!,
        spender: sushiRoll.address,
        value: amountToMigrate.toFixed(0),
      }
    );

    const { v, r, s } = splitSignature(signature);

    sushiRoll.migrateWithPermit(
      tokens[0],
      tokens[1],
      amountToMigrate.toFixed(0),
      minimumAmouts[0].toFixed(0),
      minimumAmouts[1].toFixed(0),
      deadline,
      v,
      r,
      s
    );
  }, [
    pair,
    chainId,
    account,
    amountToMigrate,
    sushiRoll,
    library,
    minimumAmouts,
    tokens,
  ]);

  return (
    <div>
      {!hasApproval ? (
        <>
          <button
            onClick={() => {
              if (pair && sushiRoll && account) {
                pair.approve(sushiRoll.address, amountToMigrate.toFixed(0));
              }
            }}
          >
            Approve
          </button>
          <button onClick={migrateWithPermit}>MigrateWithPermit</button>
        </>
      ) : (
        <button
          onClick={() => {
            if (pair && sushiRoll && account) {
              sushiRoll.migrate(
                tokens[0],
                tokens[1],
                amountToMigrate.toFixed(0),
                minimumAmouts[0].toFixed(0),
                minimumAmouts[1].toFixed(0),
                (Math.floor(Date.now() / 1000) + 10 * 60).toString()
              );
            }
          }}
        >
          Migrate
        </button>
      )}
    </div>
  );
};

export default MigrateUniswap;
