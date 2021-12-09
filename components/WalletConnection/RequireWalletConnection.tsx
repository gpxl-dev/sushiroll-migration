import { useWeb3React } from "@web3-react/core";
import React, { Children, FC, ReactNode, useState } from "react";
import WalletConnection from "./WalletConnection";

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