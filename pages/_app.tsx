import "tailwindcss/tailwind.css";

import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

function getLibrary(provider: ethers.providers.ExternalProvider) {
  return new ethers.providers.Web3Provider(provider);
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </RecoilRoot>
  );
}

export default MyApp;
