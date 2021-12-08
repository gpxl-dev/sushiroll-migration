import { useWeb3React } from "@web3-react/core";
import { Contract, providers } from "ethers";
import { useEffect, useState } from "react";
import deployments from "../constants/sushiRollDeployments";

import * as SushiRollAbi from "../abis/SushiRoll.json";

const useSushiRoll = () => {
  const [contract, setContract] = useState<Contract>();
  const { library, chainId } = useWeb3React<providers.Web3Provider>();

  useEffect(() => {
    if (!library) {
      setContract(undefined);
      return;
    }
    const signer = library.getSigner();
    const sushiRollContract = new Contract(
      deployments[chainId!],
      Array.from(SushiRollAbi),
      signer
    );
    setContract(sushiRollContract);
  }, [library, chainId]);

  return contract;
};

export default useSushiRoll;
