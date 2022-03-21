import React from 'react';
import styled from 'styled-components/macro';
import { Equation } from 'react-equation';
import { FlexContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';
import ProgressBar from '../shared/ProgressBar';
import CommonWrapper from './CommonWrapper';

const EquationContainer = styled(FlexContainer)`
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  .equation span {
    color: ${({ theme: { colors } }) => colors.white};
    font-family: ${({ theme: { fontFamily } }) => fontFamily.syncopate};
  }
`;

const VotingPower = () => {
  return (
    <CommonWrapper
      gap={16}
      containerStyle={{ marginTop: 24 }}
      cardStyle={{ paddingBottom: 32 }}
      title={
        <EquationContainer className="flex align-ce">
          <Label fontFamily="syncopate" fontSize={24}>
            Voting Power (V)
          </Label>
          <Equation className="equation" value="V = root(2, P*M)" />
        </EquationContainer>
      }
    >
      <div className="flex align-ce">
        <Label fontFamily="syncopate" fontSize={16}>
          multiplayer (m)
        </Label>

        <InfoPopup></InfoPopup>
      </div>

      <div>
        <ProgressBar maxValue={1.5} currentValue={1.1} bottomValues={[0, 0.75, 1.5]} />
      </div>
    </CommonWrapper>
  );
};

export default VotingPower;
