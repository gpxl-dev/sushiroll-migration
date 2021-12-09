import { useWeb3React } from "@web3-react/core";
import React, { FC, useCallback, useEffect, useState } from "react";
import { BigNumber as EthersBigNumber, constants, providers } from "ethers";
import { useRecoilValue } from "recoil";
import useSushiRoll from "../../hooks/useSushiRoll";
import useUniswapPair from "../../hooks/useUniswapPair";
import {
  amountToMigrateSelector,
  fractionToRemoveState,
  minimumAmountsSelector,
  selectedTokensSelector,
  userLPBalanceState,
} from "../../state/state";
import BigNumber from "bignumber.js";
import { splitSignature } from "@ethersproject/bytes";
import ErrorOverlay from "../ErrorOverlay/ErrorOverlay";

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
  const minimumAmouts = useRecoilValue(minimumAmountsSelector);
  const amountToMigrate = useRecoilValue(amountToMigrateSelector);

  const canMigrate =
    !!sushiRoll &&
    chainId &&
    account &&
    pair &&
    pair.address !== constants.AddressZero &&
    amountToMigrate !== null &&
    amountToMigrate.gt(0) &&
    minimumAmouts !== null;

  const [hasApproval, setHasApproval] = useState<boolean>(false);

  useEffect(() => {
    if (!canMigrate) return;
    pair
      .allowance(account, sushiRoll.address)
      .then((allowance: EthersBigNumber) => {
        setHasApproval(
          new BigNumber(allowance.toString()).isGreaterThanOrEqualTo(
            amountToMigrate
          )
        );
      });
  }, [pair, account, sushiRoll, amountToMigrate, canMigrate]);

  const migrateWithPermit = useCallback(async () => {
    if (!canMigrate) {
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
    canMigrate,
    amountToMigrate,
    sushiRoll,
    library,
    minimumAmouts,
    tokens,
  ]);

  const migrateWithAllowance = () => {
    if (canMigrate) {
      sushiRoll.migrate(
        tokens[0],
        tokens[1],
        amountToMigrate.toFixed(0),
        minimumAmouts[0].toFixed(0),
        minimumAmouts[1].toFixed(0),
        (Math.floor(Date.now() / 1000) + 10 * 60).toString()
      );
    }
  };

  return (
    <div className="relative w-full">
      <ErrorOverlay
        show={!canMigrate}
        header="Nothing to migrate"
        paragraphs={[
          "Based on the parameters you've selected, there's nothing we can migrate for you right now",
          "Please check your selections and try again",
        ]}
      />
      {!hasApproval ? (
        <>
          <button
            disabled={!canMigrate}
            onClick={() => {
              if (canMigrate) {
                pair.approve(sushiRoll.address, amountToMigrate.toFixed(0));
              }
            }}
          >
            Approve
          </button>
          <button onClick={migrateWithPermit}>MigrateWithPermit</button>
        </>
      ) : (
        <button disabled={!canMigrate} onClick={migrateWithAllowance}>
          Migrate
        </button>
      )}
    </div>
  );
};

export default MigrateUniswap;
