import { Contract, providers } from "ethers";
import { useEffect, useState } from "react";

import { factory as factoryAddress } from "../constants/uniswapDeployments";

import * as UniswapV2FactoryAbi from "../abis/UniswapV2Factory.json";
import { useWeb3React } from "@web3-react/core";

const useUniswapFactory = () => {
  const [contract, setContract] = useState<Contract>();
  const { library } = useWeb3React<providers.Web3Provider>();

  useEffect(() => {
    if (library) {
      setContract(
        new Contract(factoryAddress, Array.from(UniswapV2FactoryAbi), library)
      );
    } else {
      setContract(undefined);
    }
  }, [library]);

  return contract || null;
};

export default useUniswapFactory;
