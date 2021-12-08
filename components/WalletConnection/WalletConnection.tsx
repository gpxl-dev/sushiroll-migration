import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { providers } from "ethers";
import React, { FC } from "react";
import truncateEthAddress from "truncate-eth-address";

const WalletConnection: FC<{}> = ({}) => {
  const { account, activate } = useWeb3React<providers.Web3Provider>();

  return (
    <div>
      {account ? (
        <div>{truncateEthAddress(account)}</div>
      ) : (
        <button
          onClick={() =>
            activate(new InjectedConnector({ supportedChainIds: [1, 4, 42] }))
          }
        >
          Connect wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnection;
