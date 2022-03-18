import React from 'react';
import { FlexContainer } from '../shared/FlexContainer';
import InfoPopup from '../shared/InfoPopup';
import Label from '../shared/Label';

const CommonWrapper = ({ gap, title, popup, children, containerStyle, cardStyle }) => {
  return (
    <div className="flex column w-100" style={containerStyle}>
      <div className="flex align-ce">
        {typeof title === 'string' ? (
          <Label fontSize={16} fontFamily="syncopate" style={{ marginRight: 8 }}>
            {title}
          </Label>
        ) : (
          title
        )}
        {popup && <InfoPopup>{popup}</InfoPopup>}
      </div>

      <FlexContainer gap={gap} withGradient className="h-100  column justify-sb background-fill" style={{ marginTop: 24, ...cardStyle }}>
        {children}
      </FlexContainer>
    </div>
  );
};

export default CommonWrapper;
