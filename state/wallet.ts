import { atom, selector } from "recoil";
import { Signer, providers } from "ethers";
import { Sign } from "crypto";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const signerState = atom<Signer | null>({
  key: "signer",
  default: null,
  dangerouslyAllowMutability: true,
});

export const walletAddress = selector<string | null>({
  key: "walletAddress",
  get: async ({ get }) => {
    const signer = get(signerState);
    if (!signer) {
      console.log("no signer");
      return null;
    } else {
      console.log("getting addresses");
      return await signer.getAddress();
    }
  },
});
