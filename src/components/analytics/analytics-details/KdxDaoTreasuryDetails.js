import React from 'react';
import { Divider } from 'semantic-ui-react';
import { humanReadableNumber } from '../../../utils/reduceBalance';
import { getTokenName } from '../../../utils/token-utils';
import { FlexContainer } from '../../shared/FlexContainer';
import Label from '../../shared/Label';

const KdxDaoTreasuryDetails = ({ positions, tokensUsdPrice }) => {
  return (
    <FlexContainer className="w-100 column" gap={8}>
      {positions.map((position, index) => (
        <>
          <FlexContainer key={index} className="column" gap={16}>
            <Label fontSize={16}>
              Position {getTokenName(position.tokenAIdentifier)}/{getTokenName(position.tokenBIdentifier)}
            </Label>
            <FlexContainer className="w-100 column" gap={8}>
              <Label>Amount {getTokenName(position.tokenAIdentifier)}</Label>
              <Label fontSize={24}>{`${humanReadableNumber(position.amountTokenA)} ${getTokenName(position.tokenAIdentifier)}`}</Label>
              {tokensUsdPrice && (
                <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
                  $ {humanReadableNumber(tokensUsdPrice?.[getTokenName(position.tokenAIdentifier)] * position.amountTokenA)}
                </Label>
              )}
            </FlexContainer>
            <FlexContainer className="w-100 column" gap={8}>
              <Label>Amount {getTokenName(position.tokenBIdentifier)}</Label>
              <Label fontSize={24}>{`${humanReadableNumber(position.amountTokenB)} ${getTokenName(position.tokenBIdentifier)}`}</Label>
              {tokensUsdPrice && (
                <Label fontSize={12} mobileFontSize={12} labelStyle={{ opacity: 0.7 }}>
                  $ {humanReadableNumber(tokensUsdPrice?.[getTokenName(position.tokenBIdentifier)] * position.amountTokenB)}
                </Label>
              )}
            </FlexContainer>
            <FlexContainer className="w-100 column" gap={8}>
              <Label>Pool Share</Label>
              <Label fontSize={24}>{(position.poolShare * 100).toFixed(2)} %</Label>
            </FlexContainer>
          </FlexContainer>
          {positions.length - 1 !== index && <Divider style={{ margin: '8px 0px' }} />}
        </>
      ))}
    </FlexContainer>
  );
};

export default KdxDaoTreasuryDetails;
