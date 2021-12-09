import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import type { NextPage } from "next";
import React from "react";
import { useRecoilValue } from "recoil";
import ErrorOverlay from "../components/ErrorOverlay/ErrorOverlay";
import NextPrevTabButton from "../components/Tabs/NextPrevTabButton";
import { Tab, Tabs } from "../components/Tabs/Tabs";
import TokenList from "../components/TokenList/TokenList";
import UniswapLiquidityPosition from "../components/UniswapLiquidityPosition/UniswapLiquidityPosition";
import MigrateUniswap from "../components/UniswapMigration/UniswapMigration";
import RequireWalletConnection from "../components/WalletConnection/RequireWalletConnection";
import WalletConnection from "../components/WalletConnection/WalletConnection";
import useResetAppState from "../hooks/useResetAppState";
import { migrationCompleteState, selectedTabFamily } from "../state/state";

const Home: NextPage = () => {
  const { error } = useWeb3React();
  const currentTab = useRecoilValue(selectedTabFamily("main"));
  const complete = useRecoilValue(migrationCompleteState);
  const reset = useResetAppState();
  const unsupportedChain = error instanceof UnsupportedChainIdError;

  return (
    <div className="relative flex flex-col max-w-2xl mx-auto pt-8">
      <header className="flex flex-row justify-between items-center  mb-12">
        <h1 className="text-2xl">Migrate liquidity using SushiRoll</h1>
        <WalletConnection />
      </header>
      <div className="relative">
        <ErrorOverlay
          show={complete}
          header="Liquidity migrated successfully"
          paragraphs={[
            "Your liquidity has been succesfully moved from Uniswap to Sushiswap",
            "Click restart to do it all again!",
          ]}
          footer={
            <button className="py-2 px-4 mt-4 border-2 text-sm" onClick={reset}>
              Restart
            </button>
          }
        />
        <ErrorOverlay
          show={unsupportedChain}
          header="Unsupported network!"
          paragraphs={[
            "This prototype only supports Rinkeby and Mainnet",
            "Please switch to a supported chain via MetaMask",
          ]}
        />
        <Tabs tabsId={"main"}>
          <Tab label={"Select tokens"}>
            <RequireWalletConnection>
              <TokenList />
            </RequireWalletConnection>
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
        {!complete && !unsupportedChain && (
          <NextPrevTabButton
            type="prev"
            tabsId="main"
            disabled={currentTab === 0}
            className={classNames(
              "absolute text-2xl left-0 top-64 p-4",
              "transition-opacity opacity-1",
              {
                "opacity-0 cursor-default": currentTab === 0,
              }
            )}
          >
            &lt;
          </NextPrevTabButton>
        )}
        {!complete && !unsupportedChain && (
          <NextPrevTabButton
            type="next"
            tabsId="main"
            disabled={currentTab === 2}
            className={classNames(
              "absolute text-2xl right-0 top-64 p-4",
              "transition-opacity opacity-1",
              {
                "opacity-0 cursor-default": currentTab === 2,
              }
            )}
          >
            &gt;
          </NextPrevTabButton>
        )}
      </div>
    </div>
  );
};

export default Home;
