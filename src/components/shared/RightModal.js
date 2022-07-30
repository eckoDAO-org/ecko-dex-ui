import React, { useRef } from 'react';
import styled from 'styled-components/macro';
import { CloseIcon } from '../../assets';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import Label from '../shared/Label';

const Container = styled.div`
  width: 335px;
  position: fixed;
  background: ${({ theme: { colors } }) => colors.primary};
  box-shadow: -10px 0px 40px #00000066;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  transition: width 0.3s, transform 0.3s;
  z-index: 15;
  transform: ${({ open, right }) => (open ? 'translateX(0)' : 'translateX(+200%)')};

  scrollbar-width: none;
  ::-webkit-scrollbar {
    width: 0px;
  }
  scrollbar-width: none;

  .info-popup {
    line-height: 18px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  z-index: 2;
  padding: 16px;
  color: ${({ theme: { colors } }) => colors.white};
  min-height: 56px;
  border-radius: 0px !important;
  box-shadow: ${({ theme }) => theme.boxShadow};
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const IconContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 20px;
  cursor: pointer;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  z-index: 1;
  padding: 16px 26px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ theme: colors }) => colors.white};
  overflow: auto;
  flex: 1;
`;

const RightModal = ({ className, title, open, onClose, customIcon, removeIcon, titleStyle, content, footer, contentStyle }) => {
  const ref = useRef();
  useOnClickOutside(ref, () => open && onClose());

  return (
    <Container ref={ref} open={open} right={window.innerWidth}>
      <>
        <Header style={titleStyle}>
          <Label outGameEditionView fontFamily="syncopate">
            {title}
          </Label>
          <IconContainer onClick={onClose}>{!removeIcon && (customIcon || <CloseIcon style={{ height: 10, width: 10 }} />)}</IconContainer>
        </Header>

        <Content className={className} style={contentStyle}>
          {content}
        </Content>

        {footer && <FooterContainer>{footer}</FooterContainer>}
      </>
    </Container>
  );
};

export default RightModal;
