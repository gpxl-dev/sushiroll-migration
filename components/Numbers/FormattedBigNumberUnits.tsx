import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "bignumber.js";
import React, { FC } from "react";

/**
 *  Basic utility to make long numbers look a bit neater! Not intended for
 * displaying figures where high accuracy is paramount. Doesn't perform any
 * rounding when cropping decimal points!
 *
 * @param input String representation of a nunber containing a decimal point.
 * @param decimalPlaces Desired decimal places if less than 1
 * @returns A trimmed string with `decimalPlaces` decimal places if less than
 *          1, or fewer if greater than 1.
 */
function fixLength(input: string, decimalPlaces: number) {
  const [before, after] = input.split(".");
  let desiredDecimals = decimalPlaces;
  if (before.length > 1) {
    desiredDecimals = Math.max(0, desiredDecimals - (before.length - 1));
  }
  if (after.length < decimalPlaces) {
    return `${before}.${after.padEnd(desiredDecimals, "0")}`;
  } else if (after.length > desiredDecimals) {
    return `${before}.${after.substr(0, desiredDecimals)}`;
  } else {
    return input;
  }
}

/**
 * Formats a BigNumber, replacing it with `loading...` if null.
 */
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
