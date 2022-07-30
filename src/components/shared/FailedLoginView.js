import React from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import { ErrorIcon } from '../../assets';
import CustomButton from './CustomButton';
import Backdrop from './Backdrop';
import ModalContainer from './ModalContainer';

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 385px;
  width: 100%;
  z-index: 8;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.div`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.syncopate};
  font-size: 24px;
  padding: 16px;
  color: #ffffff;
`;

const SubTitle = styled.div`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.syncopate};
  font-size: 16px;
  color: #ffffff;
`;

const FailedLoginView = ({ onClose, show, accountName }) => {
  return (
    <Transition items={show} from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
      {(show) =>
        show &&
        ((props) => (
          <Container style={props}>
            <Backdrop onClose={onClose} />
            <ModalContainer
              title="transaction details"
              containerStyle={{
                maxHeight: '80vh',
                maxWidth: '90vw',
              }}
              onClose={onClose}
            >
              <Content>
                <Title>Connection Issue: How to fix this?</Title>
                <SubTitle>
                  {`Please make sure the account ${accountName} exist on chain 2 of the kadena
                  blockchain`}
                </SubTitle>
                <CustomButton
                  onClick={() => {
                    onClose();
                  }}
                >
                  Retry
                </CustomButton>
              </Content>
            </ModalContainer>
          </Container>
        ))
      }
    </Transition>
  );
};

export default FailedLoginView;
