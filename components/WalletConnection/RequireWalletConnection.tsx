import { useWeb3React } from "@web3-react/core";
import React, { FC } from "react";
import WalletConnection from "./WalletConnection";

/**
 * Wrapper component to display a "connect wallet" screen instead of the child
 * if wallet isn't connected.
 */
const RequireWalletConnection: FC<{}> = ({ children }) => {
  const { active } = useWeb3React();
  return active ? (
    <>{children}</>
  ) : (
    <div className="flex flex-col items-center">
      <p className="font-serif p-8"> Please connect your wallet to continue.</p>
      <WalletConnection />
    </div>
  );
};

export default RequireWalletConnection;
