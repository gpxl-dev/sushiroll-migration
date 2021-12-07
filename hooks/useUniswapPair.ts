import { useWeb3React } from "@web3-react/core";
import { Contract, providers } from "ethers";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import * as UniswapV2PairAbi from "../abis/UniswapV2Pair.json";
import useUniswapFactory from "./useUniswapFactory";

const useUniswapPair = (
  tokenAAddress: string | null,
  tokenBAddress: string | null
) => {
  const [contract, setContract] = useState<Contract>();
  const { library } = useWeb3React<providers.Web3Provider>();
  const factory = useUniswapFactory();

  useEffect(() => {
    if (!library || !factory || !tokenAAddress || !tokenBAddress) {
      setContract(undefined);
      return;
    }

    const signer = library.getSigner();

    const getPair = async () => {
      const pairAddress = (await factory.getPair(
        tokenAAddress,
        tokenBAddress
      )) as string;
      const pairContract = new Contract(
        pairAddress,
        Array.from(UniswapV2PairAbi),
        signer
      );
      setContract(pairContract);
    };

    getPair();
  }, [factory, tokenAAddress, tokenBAddress, library]);

  return contract;
};

export default useUniswapPair;
