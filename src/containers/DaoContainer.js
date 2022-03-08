/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';

const DaoContainer = () => {
  return (
    <>
      <FlexContainer className="column" gap={16} style={{ padding: '60px 88px 0px' }}>
        <Label fontSize={24} fontFamily="syncopate">
          proposals
        </Label>

        <FlexContainer className="row" gap={16}>
          <FlexContainer withGradient desktopStyle={{ flex: 1 }}>
            <Label fontSize={13}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Label>
          </FlexContainer>

          <FlexContainer withGradient desktopStyle={{ width: 268 }}>
            <Label fontSize={16} fontFamily="syncopate">
              multiplier
            </Label>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default DaoContainer;
