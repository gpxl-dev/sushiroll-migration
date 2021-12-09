import { useCallback } from "react";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import {
  migrationCompleteState,
  selectedTabFamily,
  selectedTokensInfoState,
} from "../state/state";

const useResetAppState = () => {
  const resetComplete = useResetRecoilState(migrationCompleteState);
  const setTab = useSetRecoilState(selectedTabFamily("main"));
  const resetTokens = useResetRecoilState(selectedTokensInfoState);
  return useCallback(() => {
    setTab(0);
    resetTokens();
    resetComplete();
  }, [resetComplete, setTab, resetTokens]);
};

export default useResetAppState;
