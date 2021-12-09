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
import { selectedTabFamily } from "../state/state";

const Home: NextPage = () => {
  const currentTab = useRecoilValue(selectedTabFamily("main"));
  return (
    <div className="relative flex flex-col max-w-2xl mx-auto pt-8">
      <header>
        <h1 className="text-2xl mb-4">Migrate liquidity using SushiRoll</h1>
      </header>
      <WalletConnection />
      <Tabs tabsId={"main"}>
        <Tab label={"Select tokens"}>
          <TokenList />
        </Tab>
        <Tab label={"Configure migration"}>
          <UniswapLiquidityPosition />
        </Tab>
        <Tab label={"Execute"}>
          <MigrateUniswap />
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
