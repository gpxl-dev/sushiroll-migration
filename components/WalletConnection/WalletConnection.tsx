import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { providers } from "ethers";
import React, { FC } from "react";
import truncateEthAddress from "truncate-eth-address";

/**
 * Simple wallet connect button / wallet address display
 */
const WalletConnection: FC<{}> = ({}) => {
  const { account, activate, deactivate, error } =
    useWeb3React<providers.Web3Provider>();
  const unsupportedChain = error instanceof UnsupportedChainIdError;

  return (
    <div>
      {account ? (
        <div>
          {truncateEthAddress(account)}
          <button
            className="font-black pl-2 text-red-500 grayscale-[50%]"
            onClick={() => {
              deactivate();
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() =>
            activate(new InjectedConnector({ supportedChainIds: [1, 4, 42] }))
          }
        >
          {unsupportedChain ? "Unsupported Chain" : "Connect wallet"}
        </button>
      )}
    </div>
  );
};

export default WalletConnection;
