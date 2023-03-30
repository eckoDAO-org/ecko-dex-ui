import React from 'react';
import { smallDecimalsFormatting } from '../../utils/reduceBalance';

const DecimalFormatted = ({ value }) => {
  const numberObject = smallDecimalsFormatting(value);
  return (
    <>
      {numberObject.beforeZeros && numberObject.zerosRemoved && numberObject.afterZeros ? (
        <span>
          $ {numberObject.beforeZeros}
          <sub style={{ fontSize: 10, bottom: '-6px' }}>{numberObject.zerosRemoved}</sub>
          {numberObject.afterZeros}
        </span>
      ) : (
        <span>$ {numberObject.initialNumber}</span>
      )}
    </>
  );
};

export default DecimalFormatted;
