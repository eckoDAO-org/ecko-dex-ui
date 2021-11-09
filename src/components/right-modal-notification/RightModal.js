import React, { useState, useEffect } from 'react';
import { Transition, Modal, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { CloseIcon } from '../../assets';

const CustomTransition = styled(Transition)``;

const Container = styled(Modal)`
  height: 100%;
  width: ${({ width }) => (width ? `${width} !important` : '335px')};
  max-width: ${({ width }) => (width ? 'unset' : '335px')};
  margin-top: 0px;
  right: 0;
  top: 0;
  margin: 0px !important;
  background-color: rgba(78, 18, 90, 0.4) !important;
  opacity: 1;
  -webkit-backdrop-filter: blur(2em);
  backdrop-filter: blur(2em);

  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  border-radius: 0px !important;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel - 1}px`}) {
    max-width: 100% !important;
    width: 100% !important;
  }
`;

const ContentContainer = styled.div`
  height: ${({ theme: { header, breadcrumbHeight = 0 } }) =>
    `calc(100% - ${header.height + breadcrumbHeight}px)`};
  overflow: auto;
  z-index: 1;
  overflow-x: hidden;
`;

const Title = styled.div`
  font-size: 16px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  color: ${({ theme: { colors } }) => colors.white};
  margin-left: 10px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  padding: 10px 19px;
  background-color: ${({ theme: { colors } }) => colors.hippiePink};
  color: white;
  min-height: 56px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
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
}) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  return (
    <CustomTransition
      animation='slide left'
      duration={duration}
      visible={isVisible}
      unmountOnHide
    >
      <Container
        mountNode={mountNode}
        open={open}
        width={width}
        id='right_modal'
        onUnmount={onClose}
        dimmer='blurring'
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
              {!removeIcon &&
                (customIcon || <CloseIcon style={{ height: 10, width: 10 }} />)}
            </IconContainer>
          </Header>
        )}

        <ContentContainer style={contentStyle}>
          {children || content}
        </ContentContainer>
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
