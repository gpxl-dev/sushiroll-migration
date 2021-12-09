import { BigNumber } from "bignumber.js";
import { formatUnits } from "@ethersproject/units";
import React, { FC } from "react";

function fixLength(input: string, decimalPlaces: number) {
  const [before, after] = input.split(".");
  let desiredDecimals = decimalPlaces;
  if (before.length > 1) {
    desiredDecimals -= before.length - 1;
  }
  if (after.length < decimalPlaces) {
    return `${before}.${after.padEnd(desiredDecimals, "0")}`;
  } else if (after.length > desiredDecimals) {
    return `${before}.${after.substr(0, desiredDecimals)}`;
  } else {
    return input;
  }
}

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
        fixLength(formatUnits(value.toFixed(0), decimals), 9)
      )}
    </span>
  );
};

export default FormattedNumber;
