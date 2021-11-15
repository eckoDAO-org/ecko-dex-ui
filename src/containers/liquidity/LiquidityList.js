import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { Loader, Button, Header, Divider } from 'semantic-ui-react';

import CustomButton from '../../shared/CustomButton';
import TokenPair from './TokenPair';

import { LiquidityContext } from '../../contexts/LiquidityContext';
import { AccountContext } from '../../contexts/AccountContext';
import theme from '../../styles/theme';
import ModalContainer from '../../shared/ModalContainer';
import reduceToken from '../../utils/reduceToken';
import ConnectWalletModal from '../../components/modals/kdaModals/ConnectWalletModal';
import { ModalContext } from '../../contexts/ModalContext';
import { GameEditionContext } from '../../contexts/GameEditionContext';

const Container = styled.div`
  display: flex;
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  height: ${({ gameEditionView }) => gameEditionView && '100%'};
`;

const TextContainer = styled.div`
  display: flex;
  flex-flow: column;
  text-align: left;
  justify-content: flex-start;
  width: 100%;

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    display: table;
  }
`;

const BottomContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: left;
  justify-content: flex-start;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  margin-right: 2px;
  width: 100%;
  position: ${({ gameEditionView }) => gameEditionView && 'absolute'};
  bottom: ${({ gameEditionView }) => gameEditionView && '10px'};
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const FormContainer = styled.div`
  position: ${({ gameEditionView }) => !gameEditionView && `relative`};
  display: table;
  flex-flow: column;
  padding: ${({ gameEditionView }) => (gameEditionView ? '10px' : '20px')};
  margin-bottom: 15px;
  width: 100%;
  border-radius: 10px;
  border: ${({ gameEditionView, theme: { colors } }) =>
    gameEditionView
      ? `2px dashed ${colors.black} !important`
      : '2px solid transparent'};

  background-clip: ${({ gameEditionView }) =>
    !gameEditionView && `padding-box`};
  opacity: 1;
  background: ${({ gameEditionView }) =>
    gameEditionView
      ? `transparent`
      : `transparent linear-gradient(122deg, #070610 0%, #4c125a 100%) 0%
    0% no-repeat padding-box`};

  ${({ gameEditionView }) =>
    !gameEditionView &&
    `&:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1000;
    margin: -2px;
    border-radius: inherit;
    background: linear-gradient(to right, #ed1cb5, #ffa900, #39fffc);
  }`}

  @media (max-width: ${({ theme: { mediaQueries } }) =>
    `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    display: table;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel}px`}) {
    padding: 0;
  }
`;

const TopContainer = styled.div``;

const TitleContainer = styled.div`
  display: flex;
  justify-content: ${({ gameEditionView }) =>
    gameEditionView ? `center` : ` space-between`};
  margin-bottom: ${({ gameEditionView }) =>
    gameEditionView ? `20px` : ` 24px`};
  width: 93%;
`;
const Title = styled.span`
  font: ${({ gameEditionView }) =>
    gameEditionView
      ? `normal normal normal 16px/19px  ${theme.fontFamily.pressStartRegular}`
      : ` normal normal bold 32px/57px ${theme.fontFamily.bold}`};
  letter-spacing: 0px;
  color: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView ? colors.black : '#ffffff'};
  text-transform: ${({ gameEditionView }) =>
    gameEditionView ? `uppercase` : ` capitalize`}; ;
`;

const LiquidityList = (props) => {
  const modalContext = useContext(ModalContext);
  const liquidity = useContext(LiquidityContext);
  const { account } = useContext(AccountContext);
  const { gameEditionView, openModal } = useContext(GameEditionContext);
  const [activeIndex, setActiveIndex] = useState(null);
  console.log(
    '🚀 ~ file: LiquidityList.js ~ line 136 ~ LiquidityList ~ activeIndex',
    activeIndex
  );

  useEffect(async () => {
    liquidity.getPairListAccountBalance(account.account);
  }, [account.account]);

  return (
    <Container gameEditionView={gameEditionView}>
      <ModalContainer
        withoutRainbowBackground
        gameEditionView={gameEditionView}
        containerStyle={{
          maxHeight: gameEditionView ? '60vh' : '80vh',
          maxWidth: 900,
          overflow: 'auto',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
        }}
      >
        {gameEditionView && (
          <TitleContainer gameEditionView={gameEditionView}>
            <Title gameEditionView={gameEditionView}>Pool</Title>
          </TitleContainer>
        )}
        <TextContainer
          style={{
            marginBottom: gameEditionView ? 15 : 30,
            background: 'transparent',
            textAlign: 'left',
            color: gameEditionView ? theme.colors.black : '#FFFFFF',
          }}
        >
          <h1
            style={{
              fontSize: gameEditionView ? 16 : 24,
              fontFamily: gameEditionView
                ? theme.fontFamily.pressStartRegular
                : theme.fontFamily.bold,
            }}
          >
            Liquidity provider rewards
          </h1>
          <p
            style={{
              fontSize: gameEditionView ? 12 : 16,
              fontFamily: gameEditionView
                ? theme.fontFamily.pressStartRegular
                : theme.fontFamily.regular,
            }}
          >
            Liquidity providers earn a 0.3% fee on all trades proportional to
            their share of the pool.
            <br />
            Fees are added to the pool, accrue in real time and can be claimed
            by withdrawing your liquidity.
          </p>
        </TextContainer>
        {account.account !== null ? (
          <BottomContainer>
            <TopContainer>
              <Header
                style={{
                  fontSize: gameEditionView ? 16 : 32,
                  textAlign: 'left ',
                  color: gameEditionView ? theme.colors.black : '#FFFFFF',
                  fontFamily: gameEditionView
                    ? theme.fontFamily.pressStartRegular
                    : theme.fontFamily.bold,
                }}
              >
                Your Liquidity
              </Header>
              <ButtonContainer
                style={{ marginBottom: gameEditionView ? 15 : 30 }}
              >
                <Button.Group fluid>
                  <CustomButton
                    disabled
                    buttonStyle={{
                      marginRight: '15px',
                      borderRadius: '20px',
                      width: '48%',
                    }}
                    onClick={() => props.selectCreatePair()}
                  >
                    Create a pair
                  </CustomButton>
                  <CustomButton
                    buttonStyle={{
                      marginLeft: '-5px',
                      borderRadius: '20px',
                      width: '48%',
                    }}
                    onClick={() => props.selectAddLiquidity()}
                  >
                    Add Liquidity
                  </CustomButton>
                </Button.Group>
              </ButtonContainer>
            </TopContainer>
            {account.account !== null ? (
              liquidity.pairListAccount[0] ? (
                <FormContainer gameEditionView={gameEditionView}>
                  {Object.values(liquidity.pairListAccount).map(
                    (pair, index) => {
                      return pair && pair.balance ? (
                        <>
                          {' '}
                          <TokenPair
                            key={pair.name}
                            pair={pair}
                            selectAddLiquidity={props.selectAddLiquidity}
                            selectRemoveLiquidity={props.selectRemoveLiquidity}
                            setTokenPair={props.setTokenPair}
                            activeIndex={activeIndex}
                            index={index}
                            setActiveIndex={setActiveIndex}
                          />{' '}
                          {!Object.values(liquidity.pairListAccount).length ===
                            index && (
                            <Divider
                              style={{
                                width: '100%',
                                margin: '20px 0px',
                                borderTop: gameEditionView
                                  ? `1px dashed ${theme.colors.black}`
                                  : `1px solid  ${theme.colors.white}`,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <></>
                      );
                    }
                  )}
                </FormContainer>
              ) : (
                <FormContainer gameEditionView={gameEditionView}>
                  <Loader
                    active
                    inline='centered'
                    style={{
                      color: gameEditionView ? theme.colors.black : '#FFFFFF',
                      fontFamily: gameEditionView
                        ? theme.fontFamily.pressStartRegular
                        : theme.fontFamily.regular,
                    }}
                  >
                    Loading..
                  </Loader>
                </FormContainer>
              )
            ) : (
              <></>
            )}
          </BottomContainer>
        ) : (
          <ButtonContainer
            gameEditionView={gameEditionView}
            style={{
              width: gameEditionView && '93%',
              justifyContent: !gameEditionView && 'start',
            }}
          >
            <Button.Group fluid={gameEditionView}>
              <CustomButton
                hover={true}
                buttonStyle={{
                  padding: !gameEditionView && '10px 16px',
                  width: !gameEditionView && '214px',
                  height: !gameEditionView && '40px',
                }}
                fontSize={14}
                onClick={() => {
                  if (gameEditionView) {
                    return openModal({
                      isVisible: true,
                      title: account?.account
                        ? 'wallet connected'
                        : 'connect wallet',
                      description: account?.account
                        ? `Account ID: ${reduceToken(account.account)}`
                        : 'Connect a wallet using one of the methods below',
                      content: <ConnectWalletModal />,
                    });
                  } else {
                    modalContext.openModal({
                      title: account?.account
                        ? 'wallet connected'
                        : 'connect wallet',
                      description: account?.account
                        ? `Account ID: ${reduceToken(account.account)}`
                        : 'Connect a wallet using one of the methods below',
                      content: <ConnectWalletModal />,
                    });
                  }
                }}
              >
                Connect Wallet
              </CustomButton>
            </Button.Group>
          </ButtonContainer>
        )}
      </ModalContainer>
    </Container>
  );
};

export default LiquidityList;
