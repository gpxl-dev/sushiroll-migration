import React, { FC } from "react";
import { useSetRecoilState } from "recoil";
import { selectedTabFamily } from "../../state/state";

/**
 * Button for navigating between `Tab`s in `Tabs` component.
 */
const NextPrevTabButton: FC<{
  tabsId: string;
  type: "next" | "prev";
  className?: string;
  disabled?: boolean;
}> = ({ tabsId, type, className, children, disabled }) => {
  const onClick = useSetRecoilState(selectedTabFamily(tabsId)).bind(
    null,
    (current) => (type === "next" ? current + 1 : current - 1)
  );
  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children || type}
    </button>
  );
};

export default NextPrevTabButton;
