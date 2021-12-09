import classNames from "classnames";
import React, { FC } from "react";

type ButtonWithLoaderProps = {
  disabled?: boolean;
  loading?: boolean;
  done?: boolean;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
};

const ButtonWithLoader: FC<ButtonWithLoaderProps> = ({
  disabled,
  loading,
  done,
  onClick,
  children,
}) => {
  return (
    <button
      className="relative"
      disabled={disabled || loading}
      onClick={onClick}
    >
      <span
        className={classNames({
          "opacity-50": disabled,
          "cursor-not-allowed": disabled,
          "cursor-wait": loading,
        })}
      >
        {children}
      </span>
      {done && <span className="absolute ml-2">✓</span>}
      {loading && <span className="absolute ml-2 animate-spin">.</span>}
    </button>
  );
};

export default ButtonWithLoader;
