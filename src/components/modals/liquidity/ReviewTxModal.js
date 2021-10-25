import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-spring/renderprops';
import ModalContainer from '../../../shared/ModalContainer';
import { reduceBalance } from '../../../utils/reduceBalance';
import Backdrop from '../../../shared/Backdrop';
import CustomButton from '../../../shared/CustomButton';
import { SuccessfullIcon } from '../../../assets';
import { PactContext } from '../../../contexts/PactContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import GameEditionModalsContainer from '../../game-edition/GameEditionModalsContainer';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  max-width: 385px;
  width: 100%;
  z-index: 5;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  svg {
    display: ${({ gameEditionView }) => gameEditionView && 'none '};
  }
  width: 97%;
  position: ${({ gameEditionView }) => gameEditionView && 'absolute'};
  bottom: ${({ gameEditionView }) => gameEditionView && '138px'};
`;

// const AmountLabel = styled.span`
//   font-family: montserrat-bold;
//   display: flex;
//   flex-direction: row;
//   font-size: 13px;
//   color: #FFFFFF;
//   margin-bottom: 10px;
// `;

// const RowContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin: 15px 0px;
// `;

// const Divider = styled.div`
//   border: ${({ theme: { colors } }) => `1px solid ${colors.border}`};
//   margin: 16px 0px;
//   width: 100%;
// `;

const Title = styled.div`
  font-family: montserrat-bold;
  font-size: 24px;
  color: #ffffff; ;
`;

const TransactionsDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 0px;
  padding-top: 5px;
`;

const SpaceBetweenRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SubTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubTitle = styled.div`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '14px' : '16px')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : '#ffffff'};
  text-align: ${({ gameEditionView }) => (gameEditionView ? 'left' : 'center')};
  width: ${({ gameEditionView }) => (gameEditionView ? '100%' : 'auto')};
  align-items: center;
  position: relative;
  justify-content: center;
`;

const Label = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '13px')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : '#ffffff'};
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '10px' : '13px')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : '#ffffff'};
`;

const ReviewTxModal = ({
  show,
  onClose,
  fromValues,
  toValues,
  loading,
  supply,
  liquidityView,
}) => {
  const pact = useContext(PactContext);
  const { gameEditionView } = useContext(GameEditionContext);

  const ContentView = () => {
    if (liquidityView === 'Add Liquidity') {
      return (
        <TransactionsDetails>
          <SubTitleContainer>
            <SubTitle
              style={{
                marginBottom: '15px',
                justifyContent: 'center',
              }}
              gameEditionView={gameEditionView}
            >
              Deposit Desired:
            </SubTitle>
          </SubTitleContainer>
          <SpaceBetweenRow>
            <Label gameEditionView={gameEditionView}>{fromValues.coin}</Label>
            <Value gameEditionView={gameEditionView}>{fromValues.amount}</Value>
          </SpaceBetweenRow>
          <SpaceBetweenRow style={{ padding: '16px 0px' }}>
            <Label gameEditionView={gameEditionView}>{toValues.coin}</Label>
            <Value gameEditionView={gameEditionView}>{toValues.amount}</Value>
          </SpaceBetweenRow>
          <SubTitleContainer>
            <SubTitle
              style={{
                marginBottom: '15px',
                justifyContent: 'center',
              }}
              gameEditionView={gameEditionView}
            >
              Rates:
            </SubTitle>
          </SubTitleContainer>
          <SpaceBetweenRow>
            <Label
              gameEditionView={gameEditionView}
            >{`1 ${fromValues?.coin}`}</Label>
            <Value gameEditionView={gameEditionView}>
              {`${reduceBalance(1 / pact.ratio)} ${toValues?.coin}`}
            </Value>
          </SpaceBetweenRow>
          <SpaceBetweenRow style={{ padding: '16px 0px' }}>
            <Label
              gameEditionView={gameEditionView}
            >{`1 ${toValues?.coin} `}</Label>
            <Value gameEditionView={gameEditionView}>{`${reduceBalance(
              pact.ratio
            )} ${fromValues?.coin}`}</Value>
          </SpaceBetweenRow>
          <SpaceBetweenRow>
            <Label gameEditionView={gameEditionView}>Share of Pool:</Label>
            <Value gameEditionView={gameEditionView}>
              {reduceBalance(pact.share(fromValues?.amount) * 100)}%
            </Value>
          </SpaceBetweenRow>
        </TransactionsDetails>
      );
    } else {
      return (
        <TransactionsDetails>
          <SpaceBetweenRow>
            <Label>{`1 ${fromValues?.coin}`}</Label>
            <Value>
              {`${reduceBalance(toValues.amount / fromValues.amount)} ${
                toValues.coin
              }`}
            </Value>
          </SpaceBetweenRow>
          <SpaceBetweenRow style={{ padding: '16px 0px' }}>
            <Label>{`1 ${toValues?.coin} `}</Label>
            <Value>
              {`${reduceBalance(fromValues.amount / toValues.amount)} ${
                fromValues.coin
              }`}
            </Value>
          </SpaceBetweenRow>
        </TransactionsDetails>
      );
    }
  };

  return gameEditionView && show ? (
    <GameEditionModalsContainer
      modalStyle={{ zIndex: 1 }}
      title='Preview Successful!'
      content={
        <Content gameEditionView={gameEditionView}>
          <SuccessfullIcon />
          {ContentView()}
          <CustomButton
            buttonStyle={{
              width: '100%',
              position: 'absolute',
              bottom: '-130px',
            }}
            loading={loading}
            onClick={supply}
          >
            Confirm
          </CustomButton>
        </Content>
      }
    />
  ) : (
    <Transition
      items={show}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
    >
      {(show) =>
        show &&
        ((props) => (
          <Container style={props}>
            <Backdrop onClose={onClose} />
            <ModalContainer
              title='Preview Successful!'
              containerStyle={{
                height: '100%',
                maxHeight: '80vh',
                maxWidth: '90vw',
              }}
              onClose={onClose}
            >
              <Content>
                <SuccessfullIcon />
                <Title style={{ padding: '16px 0px' }}>
                  Transaction Details
                </Title>
                {ContentView()}
                <CustomButton
                  buttonStyle={{ width: '100%' }}
                  loading={loading}
                  onClick={supply}
                >
                  Confirm
                </CustomButton>
              </Content>
            </ModalContainer>
          </Container>
        ))
      }
    </Transition>
  );
};

export default ReviewTxModal;
