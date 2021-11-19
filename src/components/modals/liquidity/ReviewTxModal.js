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
import tokenData from '../../../constants/cryptoCurrencies';

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
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  width: ${({ gameEditionView }) => (gameEditionView ? '97%' : '100%')};
  position: ${({ gameEditionView }) => gameEditionView && 'absolute'};
  bottom: ${({ gameEditionView }) => gameEditionView && '138px'};
`;

const Title = styled.div`
  font-family: montserrat-bold;
  font-size: 24px;
  ${({ theme: { colors } }) => colors.white};
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

const FlexStartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const FlexEndRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const SubTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubTitle = styled.div`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  font-size: ${({ gameEditionView }) => (gameEditionView ? '14px' : '13px')};
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : colors.white};
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
    gameEditionView ? colors.black : colors.white};
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  font-size: 10px;
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : `${colors.white}99`};
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

  const showTicker = (ticker) => {
    if (ticker === 'coin') return 'KDA';
    else if (ticker === 'runonflux.flux') return 'FLUX';
    else return ticker.toUpperCase();
  };

  const getTokenIcon = (token) => {
    return tokenData[showTicker(token)].icon;
  };

  const ContentView = () => {
    if (liquidityView === 'Add Liquidity') {
      return (
        <TransactionsDetails>
          <FlexStartRow>
            <SubTitle
              style={{
                margin: '16px 0',
                justifyContent: 'center',
              }}
              gameEditionView={gameEditionView}
            >
              Deposit Desired
            </SubTitle>
          </FlexStartRow>

          {/* FIRST COIN */}
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(fromValues.coin)}
              <Label gameEditionView={gameEditionView}>
                {fromValues.amount}
              </Label>
            </FlexStartRow>
            <Label gameEditionView={gameEditionView}>{fromValues.coin}</Label>
          </SpaceBetweenRow>
          {/* FIRST RATE */}
          <FlexEndRow style={{ padding: '8px 0px 16px 0px' }}>
            <Value gameEditionView={gameEditionView}>{`1 ${
              fromValues?.coin
            } =  ${reduceBalance(1 / pact.ratio)} ${toValues?.coin}`}</Value>
          </FlexEndRow>
          {/* SECOND COIN */}
          <SpaceBetweenRow>
            <FlexStartRow>
              {getTokenIcon(toValues.coin)}
              <Label gameEditionView={gameEditionView}>{toValues.amount}</Label>
            </FlexStartRow>
            <Label gameEditionView={gameEditionView}>{toValues.coin}</Label>
          </SpaceBetweenRow>
          {/* SECOND RATE */}
          <FlexEndRow style={{ padding: '8px 0px' }}>
            <Value gameEditionView={gameEditionView}>{`1 ${
              toValues?.coin
            } =  ${reduceBalance(1 / pact.ratio)} ${fromValues?.coin}`}</Value>
          </FlexEndRow>
          <SpaceBetweenRow>
            <Value gameEditionView={gameEditionView}>Share of Pool:</Value>
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
      onClose={onClose}
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
              title='Transaction Details'
              containerStyle={{
                height: '100%',
                maxHeight: '80vh',
                maxWidth: '90vw',
              }}
              onClose={onClose}
            >
              <Content>
                <Title style={{ padding: '16px 0px', fontSize: 16 }}>
                  Preview Succesful
                </Title>
                <SuccessfullIcon />
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
