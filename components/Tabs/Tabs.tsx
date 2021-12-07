import classnames from "classnames";
import { FC, ReactElement, ReactNode, useMemo, useState } from "react";

interface TabProps {
  label: ReactNode;
}

export const Tab: FC<TabProps> = ({ children }) => {
  return <section>{children}</section>;
};

export const Tabs: FC<{
  children: ReactElement<TabProps> | Array<ReactElement<TabProps>>;
}> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const childrenAsArray: Array<ReactElement<TabProps>> = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children]
  );

  return (
    <>
      <div>
        {childrenAsArray.map((child, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={classnames({
              "font-bold": activeIndex === i,
            })}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div>
        {childrenAsArray.map((child, i) => (
          <div
            key={i}
            className={classnames({
              hidden: activeIndex !== i,
            })}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
};
