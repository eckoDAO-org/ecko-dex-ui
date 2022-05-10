/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { FlexContainer } from '../components/shared/FlexContainer';
import theme from '../styles/theme';
import Label from '../components/shared/Label';
import InfoPopup from '../components/shared/InfoPopup';

const BuyCryptoContainer = () => {
  return (
    <FlexContainer
      className="column w-100 h-100"
      gap={24}
      style={{ paddingTop: 35, paddingBottom: 35 }}
      desktopStyle={{ paddingRight: theme.layout.desktopPadding, paddingLeft: theme.layout.desktopPadding }}
      tabletStyle={{ paddingRight: theme.layout.tabletPadding, paddingLeft: theme.layout.tabletPadding }}
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
          {/* ToDo: Here Form */}
        </FlexContainer>
      </div>
    </FlexContainer>
  );
};

export default BuyCryptoContainer;
