/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components/macro';
import theme from '../styles/theme';
import Label from '../components/shared/Label';
import BuyCryptoForm from '../components/buy-crypto/BuyCryptoForm';
import InfoPopup from '../components/shared/InfoPopup';
import { FadeIn } from '../components/shared/animations';
import { FlexContainer } from '../components/shared/FlexContainer';

const Container = styled(FadeIn)`
  width: 100%;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  padding-top: 80px;
  padding-bottom: 35px;
  max-width: 550px;
  overflow: visible;
`;

const BuyCryptoContainer = () => {
  return (
    <Container>
      <FlexContainer
        className="column w-100 h-100"
        gap={24}
        mobileStyle={{ paddingRight: theme.layout.mobilePadding, paddingLeft: theme.layout.mobilePadding }}
      >
        <div className="flex column w-100 h-100">
          <div className="flex align-ce">
            <Label fontSize={16} fontFamily="syncopate" style={{ marginRight: 8 }}>
              buy crypto
            </Label>
            <InfoPopup type="modal" title="popuptitle" centerIcon>
              <Label>Buy crypto through Simplex...</Label>
            </InfoPopup>
          </div>

          <FlexContainer withGradient className="column align-ce background-fill" style={{ marginTop: 24 }}>
            <BuyCryptoForm />
          </FlexContainer>
        </div>
      </FlexContainer>
    </Container>
  );
};

export default BuyCryptoContainer;
