import { BigNumber } from "bignumber.js";
import { formatUnits } from "@ethersproject/units";
import React, { FC } from "react";

const FormattedNumber: FC<{
  value: BigNumber | null;
  decimals: number;
  className?: string;
}> = ({ value, decimals, className }) => {
  return (
    <span className={className}>
      {value === null ? (
        <span className="opacity-60">Loading...</span>
      ) : (
        formatUnits(value.toFixed(0), decimals)
      )}
    </span>
  );
};

export default FormattedNumber;
