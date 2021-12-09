import classNames from "classnames";
import { providers } from "ethers";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import NextPrevTabButton from "../components/Tabs/NextPrevTabButton";
import { Tab, Tabs } from "../components/Tabs/Tabs";
import TokenList from "../components/TokenList/TokenList";
import UniswapLiquidityPosition from "../components/UniswapLiquidityPosition/UniswapLiquidityPosition";
import MigrateUniswap from "../components/UniswapMigration/UniswapMigration";
import WalletConnection from "../components/WalletConnection/WalletConnection";
import RequireWalletConnection from "../components/WalletConnection/RequireWalletConnection";
import { selectedTabFamily } from "../state/state";

const Home: NextPage = () => {
  const currentTab = useRecoilValue(selectedTabFamily("main"));
  return (
    <div className="relative flex flex-col max-w-2xl mx-auto pt-8">
      <header className="flex flex-row justify-between items-center  mb-4">
        <h1 className="text-2xl">Migrate liquidity using SushiRoll</h1>
        <WalletConnection />
      </header>
      <Tabs tabsId={"main"}>
        <Tab label={"Select tokens"}>
          <TokenList />
        </Tab>
        <Tab label={"Configure migration"}>
          <RequireWalletConnection>
            <UniswapLiquidityPosition />
          </RequireWalletConnection>
        </Tab>
        <Tab label={"Execute"}>
          <RequireWalletConnection>
            <MigrateUniswap />
          </RequireWalletConnection>
        </Tab>
      </Tabs>
      <NextPrevTabButton
        type="prev"
        tabsId="main"
        disabled={currentTab === 0}
        className={classNames(
          "absolute text-2xl left-0 top-52 p-4",
          "transition-opacity opacity-1",
          {
            "opacity-0 cursor-default": currentTab === 0,
          }
        )}
      >
        &lt;
      </NextPrevTabButton>
      <NextPrevTabButton
        type="next"
        tabsId="main"
        disabled={currentTab === 2}
        className={classNames(
          "absolute text-2xl right-0 top-52 p-4",
          "transition-opacity opacity-1",
          {
            "opacity-0 cursor-default": currentTab === 2,
          }
        )}
      >
        &gt;
      </NextPrevTabButton>
    </div>
  );
};

export default Home;
