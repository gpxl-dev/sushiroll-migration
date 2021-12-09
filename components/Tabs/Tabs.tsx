import classnames from "classnames";
import { FC, ReactElement, ReactNode, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedTabFamily } from "../../state/state";

interface TabProps {
  label: ReactNode;
}

export const Tab: FC<TabProps> = ({ children }) => {
  return <section>{children}</section>;
};

export const Tabs: FC<{
  children: ReactElement<TabProps> | Array<ReactElement<TabProps>>;
  className?: string;
  tabsId: string;
}> = ({ children, className, tabsId }) => {
  const [activeIndex, setActiveIndex] = useRecoilState<number>(
    selectedTabFamily(tabsId)
  );

  const childrenAsArray: Array<ReactElement<TabProps>> = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children]
  );

  if (activeIndex >= childrenAsArray.length - 1)
    setActiveIndex(childrenAsArray.length - 1);
  else if (activeIndex < 0) setActiveIndex(0);

  return (
    <div className={className}>
      <div className="w-full flex flex-row divide-x-2 divide-solid divide-gray-200 -skew-x-12">
        {childrenAsArray.map((child, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={classnames("flex-grow p-4 relative group", {
              "font-bold": activeIndex === i,
            })}
          >
            <div className="skew-x-12 mb-1">{child.props.label}</div>
            <div
              className={classnames(
                "absolute left-[10%] w-[80%] h-1 bg-black",
                "transition-all scale-x-[0.2] opacity-0 duration-200",
                "group-hover:scale-x-50 group-hover:opacity-100",
                {
                  "!scale-x-100 opacity-100": activeIndex === i,
                }
              )}
            ></div>
          </button>
        ))}
      </div>
      <div className="p-8">
        {childrenAsArray.map((child, i) =>
          activeIndex === i ? (
            <div key={i} className={classnames("flex flex-col items-center")}>
              {child}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
