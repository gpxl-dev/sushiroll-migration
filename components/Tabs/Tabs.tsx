import classnames from "classnames";
import { FC, ReactElement, ReactNode, useMemo } from "react";
import { useRecoilState } from "recoil";
import { selectedTabFamily } from "../../state/state";

interface TabProps {
  label: ReactNode;
}

export const Tab: FC<TabProps> = ({ children }) => {
  return <section className="contents">{children}</section>;
};

/**
 * Simple tabs component. Requires a recoil state family param `tabsId` to
 * store current tab state to allow external navigation. Instead of an approach
 * where tabs register with this parent component, we can rely on typescript
 * to ensure that our children have the right props (in this case just a label)
 * to be used as a tab.
 */
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

  // This is needed because our buttons can push our active index out of bounds
  // An expansion could include the total number of tabs in the recoil state to
  // prevent this happening, but for this simple demo it's not a problem as
  // we are hiding the relevant buttons at extremities anyway.
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
        {childrenAsArray.map((child, i) => (
          <div
            key={i}
            className={classnames("flex flex-col items-center", {
              hidden: activeIndex !== i,
            })}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
