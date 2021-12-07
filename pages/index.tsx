import { providers } from "ethers";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Tab, Tabs } from "../components/Tabs/Tabs";
import UniswapLiquidityPosition from "../components/UniswapLiquidityPosition/UniswapLiquidityPosition";
import WalletConnection from "../components/WalletConnection/WalletConnection";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col">
      <WalletConnection />
      <Tabs>
        <Tab label={"Step 1"}>Select tokens</Tab>
        <Tab label={"Step 2"}>
          <UniswapLiquidityPosition
            tokens={[
              "0x0ace32f6e87ac1457a5385f8eb0208f37263b415",
              "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            ]}
          />
        </Tab>
        <Tab label={"Step 3"}>This is step three</Tab>
        <Tab label={"Step 4"}>This is step four</Tab>
      </Tabs>
    </div>
  );
};

export default Home;
