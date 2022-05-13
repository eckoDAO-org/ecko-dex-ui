import React from 'react';
import styled from 'styled-components/macro';
import { InfoIcon } from '../../assets';
import { useRightModalContext } from '../../contexts';
import CustomPopup from './CustomPopup';
import Label from './Label';

const InfoContainer = styled.div`
  margin-left: 12px;
  svg {
    width: ${({ size = 24 }) => size}px;
    height: ${({ size = 24 }) => size}px;
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const InfoPopup = ({ title, children, type, size, containerStyle }) => {
  const rightModalContext = useRightModalContext();
  return type === 'modal' ? (
    <InfoContainer
      style={containerStyle}
      size={size}
      onClick={() => rightModalContext.openModal({ className: 'info-popup', title, content: children, contentStyle: { padding: 16, paddingTop: 0 } })}
    >
      <InfoIcon style={{ cursor: 'pointer' }} />
    </InfoContainer>
  ) : (
    <CustomPopup
      offset={[0, -5]}
      trigger={
        <InfoContainer size={size}>
          <InfoIcon style={{ cursor: 'pointer' }} />
        </InfoContainer>
      }
      position="bottom center"
      on="click"
    >
      <Label>{children}</Label>
    </CustomPopup>
  );
};

export default InfoPopup;
