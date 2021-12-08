import { providers } from "ethers";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Tab, Tabs } from "../components/Tabs/Tabs";
import UniswapLiquidityPosition from "../components/UniswapLiquidityPosition/UniswapLiquidityPosition";
import MigrateUniswap from "../components/UniswapMigration/UniswapMigration";
import WalletConnection from "../components/WalletConnection/WalletConnection";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col">
      <WalletConnection />
      <Tabs>
        <Tab label={"Step 1"}>Select tokens</Tab>
        <Tab label={"Step 2"}>
          <UniswapLiquidityPosition />
        </Tab>
        <Tab label={"Step 3"}>
          <MigrateUniswap />
        </Tab>
        <Tab label={"Step 4"}>This is step four</Tab>
      </Tabs>
    </div>
  );
};

export default Home;
