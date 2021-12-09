import { useWeb3React } from "@web3-react/core";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  BigNumber as EthersBigNumber,
  constants,
  providers,
  Event,
} from "ethers";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useSushiRoll from "../../hooks/useSushiRoll";
import useUniswapPair from "../../hooks/useUniswapPair";
import {
  amountToMigrateSelector,
  approvePendingState,
  fractionToRemoveState,
  lpInvertedState,
  migratePendingState,
  migrationCompleteState,
  minimumAmountsSelector,
  selectedTokensInfoState,
  selectedTokensSelector,
} from "../../state/state";
import BigNumber from "bignumber.js";
import { splitSignature } from "@ethersproject/bytes";
import ErrorOverlay from "../ErrorOverlay/ErrorOverlay";
import classNames from "classnames";
import useFilteredEventListener from "../../hooks/useFilteredEventListener";
import FormattedNumber from "../Numbers/FormattedBigNumberUnits";

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

const MigrateUniswap: FC<{}> = ({}) => {
  const { account, chainId, library } = useWeb3React<providers.Web3Provider>();
  const tokens = useRecoilValue(selectedTokensSelector);
  const tokensInfo = useRecoilValue(selectedTokensInfoState);
  const fractionToRemove = useRecoilValue(fractionToRemoveState);
  const isInverted = useRecoilValue(lpInvertedState);
  const pair = useUniswapPair(tokens[0], tokens[1]);
  const sushiRoll = useSushiRoll();
  const minimumAmounts = useRecoilValue(minimumAmountsSelector);
  const amountToMigrate = useRecoilValue(amountToMigrateSelector);
  const [approvePending, setApprovePending] =
    useRecoilState(approvePendingState);
  const [migratePending, setMigratePending] =
    useRecoilState(migratePendingState);
  const setMigrationComplete = useSetRecoilState(migrationCompleteState);

  const canMigrate =
    !!sushiRoll &&
    chainId &&
    account &&
    pair &&
    pair.address !== constants.AddressZero &&
    amountToMigrate !== null &&
    amountToMigrate.gt(0) &&
    minimumAmounts !== null;

  const [allowance, setAllowance] = useState<BigNumber>(new BigNumber(0));

  const approvalFilter = useMemo(() => {
    if (!pair || !sushiRoll) return null;
    // Approval(owner, spender, value)
    return pair.filters.Approval([account, sushiRoll.address]);
  }, [pair, account, sushiRoll]);

  const onApproval = useCallback(
    (event: Event) => {
      if (pair) {
        const parsedEvent = pair.interface.parseLog(event);
        setAllowance((a) => a.plus(parsedEvent.args.value.toString()));
        setApprovePending(false);
      }
    },
    [pair, setApprovePending]
  );

  useFilteredEventListener(approvalFilter, onApproval);

  const transferFilter = useMemo(() => {
    if (!pair || !sushiRoll) return null;
    // Transfer(from, to, value)
    return pair.filters.Transfer([account, sushiRoll.address]);
  }, [pair, account, sushiRoll]);

  const onTransfer = useCallback(() => {
    setMigratePending(false);
    setMigrationComplete(true);
  }, [setMigratePending, setMigrationComplete]);
  useFilteredEventListener(transferFilter, onTransfer);

  useEffect(() => {
    if (!canMigrate) return;
    pair
      .allowance(account, sushiRoll.address)
      .then((allowance: EthersBigNumber) => {
        setAllowance(new BigNumber(allowance.toString()));
      });
  }, [pair, account, sushiRoll, amountToMigrate, canMigrate]);

  const migrateWithPermit = useCallback(async () => {
    if (!canMigrate) {
      return;
    }

    const signer = library!.getSigner();

    try {
      setMigratePending("permit");
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

      await sushiRoll.migrateWithPermit(
        tokens[0],
        tokens[1],
        amountToMigrate.toFixed(0),
        minimumAmounts[isInverted ? 1 : 0].toFixed(0),
        minimumAmounts[isInverted ? 0 : 1].toFixed(0),
        deadline,
        v,
        r,
        s
      );
    } catch (e: any) {
      setMigratePending(false);
    }
  }, [
    pair,
    chainId,
    account,
    canMigrate,
    amountToMigrate,
    sushiRoll,
    library,
    minimumAmounts,
    tokens,
    setMigratePending,
    isInverted,
  ]);

  const migrateWithAllowance = () => {
    if (canMigrate) {
      setMigratePending("approval");
      sushiRoll
        .migrate(
          tokens[0],
          tokens[1],
          amountToMigrate.toFixed(0),
          minimumAmounts[isInverted ? 1 : 0].toFixed(0),
          minimumAmounts[isInverted ? 0 : 1].toFixed(0),
          (Math.floor(Date.now() / 1000) + 10 * 60).toString()
        )
        .catch(() => setMigratePending(false));
    }
  };

  const hasApproval = allowance.isGreaterThanOrEqualTo(
    amountToMigrate || new BigNumber(0)
  );

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
      <div className="flex flex-col items-center">
        <div className="text-sm max-w-md">
          <p className="mb-2 mt-4">
            Use this section to migrate {(fractionToRemove * 100).toFixed(1)}%
            of your {tokensInfo[0]?.symbol}-{tokensInfo[1]?.symbol} liquidity
            from Uniswap to SushiSwap
          </p>
          <p className="mb-4">
            You can either use a separate approval transaction, or sign an
            approval permit and approve and migrate in a single transaction.
          </p>
        </div>
        <div className="flex flex-row items-center w-full">
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <button
              className="relative"
              disabled={!canMigrate || hasApproval || approvePending}
              onClick={() => {
                if (canMigrate) {
                  setApprovePending(true);
                  pair
                    .approve(sushiRoll.address, amountToMigrate.toFixed(0))
                    .catch(() => {
                      setApprovePending(false);
                    });
                }
              }}
            >
              <span
                className={classNames({
                  "opacity-50": hasApproval || approvePending,
                })}
              >
                Approve
              </span>
              {hasApproval && <span className="absolute ml-2">✓</span>}
              {approvePending && (
                <span className="absolute ml-2 animate-spin">.</span>
              )}
            </button>
            <span className="text-2xl p-4">+</span>
            <button
              disabled={!hasApproval || !!migratePending}
              className={classNames(
                "relative transition-opacity duration-200",
                {
                  "opacity-40 cursor-not-allowed": !hasApproval,
                  "cursor-wait": migratePending,
                }
              )}
              onClick={migrateWithAllowance}
            >
              <span
                className={classNames({
                  "opacity-50": !hasApproval || migratePending,
                })}
              >
                Migrate
              </span>
              {migratePending === "approval" && (
                <span className="absolute ml-2 animate-spin">.</span>
              )}
            </button>
          </div>
          <div>-OR-</div>
          <div className="flex flex-1 items-center justify-center p-6">
            <button
              disabled={!!migratePending}
              className={classNames(
                "relative transition-opacity duration-200",
                {
                  "cursor-wait": !!migratePending,
                }
              )}
              onClick={migrateWithPermit}
            >
              <span
                className={classNames({
                  "opacity-50": migratePending,
                })}
              >
                Migrate
              </span>
              {migratePending === "permit" && (
                <span className="absolute ml-2 animate-spin">.</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrateUniswap;
