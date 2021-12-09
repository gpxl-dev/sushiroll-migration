import { EventFilter, Event } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";

const useFilteredEventListener = (
  filter: EventFilter | null,
  listener: ((event: Event) => void) | null
) => {
  const { library } = useWeb3React();

  useEffect(() => {
    let listening = false;
    if (library && filter && listener) {
      library.on(filter, listener);
      listening = true;
    }

    return () => {
      if (listening) library.off(filter, listener);
    };
  }, [library, filter, listener]);
};

export default useFilteredEventListener;
