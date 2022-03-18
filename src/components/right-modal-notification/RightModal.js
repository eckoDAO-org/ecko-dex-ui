import React, { useState, useEffect } from 'react';
import { Transition, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { CloseIcon } from '../../assets';

const CustomTransition = styled(Transition)`
  transition-duration: ${({ duration }) => (duration ? `${duration}ms` : '500ms')};
`;

const Container = styled(Modal)`
  height: 100%;
  width: ${({ width }) => (width ? `${width} !important` : '335px')};
  max-width: ${({ width }) => (width ? 'unset' : '335px')};
  margin-top: 0px;
  right: 0;
  top: 0;
  margin: 0px !important;
  background-color: ${({ theme: { backgroundRightModal } }) => backgroundRightModal} !important;
  opacity: 1;
  /* -webkit-backdrop-filter: blur(2em);
  backdrop-filter: blur(2em); */

  font-family: ${({ theme: { fontFamily } }) => fontFamily.basier};
  border-radius: 0px !important;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel - 1}px`}) {
    max-width: 100% !important;
    width: 100% !important;
  }
`;

const ContentContainer = styled.div`
  height: ${({ theme: { header, breadcrumbHeight = 0, footer } }) => `calc(100% - ${header.height + breadcrumbHeight + footer.modalFooter}px)`};
  overflow: auto;
  z-index: 1;
  overflow-x: hidden;
`;

const Title = styled.div`
  font-size: 16px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.syncopate};
  color: ${({ theme: { colors } }) => colors.white};
  margin-left: 10px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  padding: 10px 22px 10px 26px;
  color: ${({ theme: { colors } }) => colors.white};
  min-height: 56px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.syncopate};
  font-size: 16px;
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
  /* margin: 10px 10px 0 10px; */
  z-index: 1;
  padding: 16px 26px;
  & > * {
    width: 200px;
  }
`;

const RightModal = ({
  open,
  onClose,
  title,
  children,
  content,
  containerStyle,
  titleStyle,
  contentStyle,
  customIcon,
  removeIcon,
  width,
  mountNode,
  duration,
  disableBackdrop,
  headerStyle,
  showHeader,
  footerButton,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  return (
    <CustomTransition animation="slide left" duration={duration} visible={isVisible} unmountOnHide>
      <Container
        mountNode={mountNode}
        open={open}
        width={width}
        id="right_modal"
        onUnmount={onClose}
        dimmer=""
        style={containerStyle}
        onClose={() => {
          if (!disableBackdrop) {
            setIsVisible(false);
          }
        }}
      >
        {showHeader && (
          <Header style={headerStyle}>
            <Title style={titleStyle}>{title}</Title>
            <IconContainer onClick={() => setIsVisible(false)}>
              {!removeIcon && (customIcon || <CloseIcon style={{ height: 10, width: 10 }} />)}
            </IconContainer>
          </Header>
        )}

        <ContentContainer style={contentStyle}>{children || content}</ContentContainer>
        <FooterContainer>{footerButton}</FooterContainer>
      </Container>
    </CustomTransition>
  );
};
export default RightModal;

RightModal.propTypes = {
  showHeader: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  duration: PropTypes.number,
  disableBackdrop: PropTypes.bool,
  width: PropTypes.string,
};

RightModal.defaultProps = {
  showHeader: true,
  title: null,
  duration: 300,
  disableBackdrop: false,
  width: null,
};
