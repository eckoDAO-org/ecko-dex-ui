import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';

const CommonWrapper = ({ gap, title, popup, children }) => {
  return (
    <div className="flex column w-100 h-100">
      <div className="flex align-ce">
        <Label fontSize={16} fontFamily="syncopate" style={{ marginRight: 8 }}>
          {title}
        </Label>
        {popup && <InfoPopup>{popup}</InfoPopup>}
      </div>

      <FlexContainer gap={gap} withGradient className="h-100  column justify-sb background-fill" style={{ marginTop: 24 }}>
        {children}
      </FlexContainer>
    </div>
  );
};

export default CommonWrapper;
