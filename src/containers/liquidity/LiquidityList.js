/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { Loader, Button, Header, Divider } from 'semantic-ui-react';
import CustomButton from '../../shared/CustomButton';
import TokenPair from './TokenPair';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { AccountContext } from '../../contexts/AccountContext';
import { theme } from '../../styles/theme';
import ModalContainer from '../../shared/ModalContainer';
import reduceToken from '../../utils/reduceToken';
import ConnectWalletModal from '../../components/modals/kdaModals/ConnectWalletModal';
import { ModalContext } from '../../contexts/ModalContext';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import GradientBorder from '../../shared/GradientBorder';
import { LightModeContext } from '../../contexts/LightModeContext';
import FormContainer from '../../shared/FormContainer';

const Container = styled.div`
  display: flex;
  margin-top: ${({ gameEditionView }) => (gameEditionView ? '0px' : '24px')};
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
  color: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? `${colors.black} !important` : colors.white)};

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
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
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const TopContainer = styled.div``;

const TitleContainer = styled.div`
  display: flex;
  justify-content: ${({ gameEditionView }) => (gameEditionView ? `center` : ` space-between`)};
  margin-bottom: ${({ gameEditionView }) => (gameEditionView ? `16px` : ` 24px`)};
`;
const Title = styled.span`
  font: ${({ gameEditionView, theme: { fontFamily } }) =>
    gameEditionView ? `normal normal normal 16px/19px  ${fontFamily.pressStartRegular}` : ` normal normal bold 32px/57px ${fontFamily.bold}`};
  letter-spacing: 0px;
  color: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? colors.black : colors.white)};
  text-transform: ${({ gameEditionView }) => (gameEditionView ? `uppercase` : ` capitalize`)}; ;
`;

const LiquidityList = (props) => {
  const modalContext = useContext(ModalContext);
  const liquidity = useContext(LiquidityContext);
  const { account } = useContext(AccountContext);
  const { gameEditionView, openModal } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    liquidity.getPairListAccountBalance(account.account);
  }, [account.account]);

  return (
    <Container gameEditionView={gameEditionView}>
      <ModalContainer
        withoutRainbowBackground
        gameEditionView={gameEditionView}
        containerStyle={{
          maxHeight: !gameEditionView && '80vh',
          maxWidth: 900,
          minWidth: 0,
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
          gameEditionView={gameEditionView}
          style={{
            marginBottom: gameEditionView ? 15 : 30,
            background: 'transparent',
            textAlign: 'left',
          }}
        >
          <h1
            style={{
              fontSize: gameEditionView ? 16 : 24,
              fontFamily: gameEditionView ? theme(themeMode).fontFamily.pressStartRegular : theme(themeMode).fontFamily.bold,
            }}
          >
            Liquidity provider rewards
          </h1>
          <p
            style={{
              fontSize: gameEditionView ? 12 : 16,
              fontFamily: gameEditionView ? theme(themeMode).fontFamily.pressStartRegular : theme(themeMode).fontFamily.regular,
            }}
          >
            Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool.
            <br />
            Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
          </p>
        </TextContainer>
        {account.account !== null ? (
          <BottomContainer>
            <TopContainer>
              <Header
                style={{
                  fontSize: gameEditionView ? 16 : 32,
                  textAlign: 'left ',
                  color: gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white,
                  fontFamily: gameEditionView ? theme(themeMode).fontFamily.pressStartRegular : theme(themeMode).fontFamily.bold,
                }}
              >
                Your Liquidity
              </Header>
              <ButtonContainer style={{ marginBottom: gameEditionView ? 15 : 30 }}>
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
                liquidity.pairListAccount[0]?.balance ? (
                  <FormContainer gameEditionView={gameEditionView} containerStyle={{ padding: gameEditionView && 16 }} withGameEditionBorder>
                    {!gameEditionView && <GradientBorder />}
                    {Object.values(liquidity.pairListAccount).map((pair, index) => {
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
                          {Object.values(liquidity.pairListAccount).length - 1 !== index && (
                            <Divider
                              style={{
                                width: '100%',
                                margin: '32px 0px',
                                borderTop: gameEditionView
                                  ? `1px dashed ${theme(themeMode).colors.black}`
                                  : `1px solid  ${theme(themeMode).colors.white}99`,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <></>
                      );
                    })}
                  </FormContainer>
                ) : (
                  <></>
                )
              ) : (
                <FormContainer gameEditionView={gameEditionView}>
                  {!gameEditionView && <GradientBorder />}
                  {liquidity.pairListAccount?.error ? (
                    <p
                      style={{
                        fontSize: gameEditionView ? 12 : 16,
                        fontFamily: gameEditionView ? theme(themeMode).fontFamily.pressStartRegular : theme(themeMode).fontFamily.regular,
                        textAlign: 'center',
                      }}
                    >
                      An error was encountered. Please reload the page
                    </p>
                  ) : (
                    <Loader
                      active
                      inline="centered"
                      style={{
                        color: gameEditionView ? theme(themeMode).colors.black : theme(themeMode).colors.white,
                        fontFamily: gameEditionView ? theme(themeMode).fontFamily.pressStartRegular : theme(themeMode).fontFamily.regular,
                      }}
                    >
                      Loading..
                    </Loader>
                  )}
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
                      title: account?.account ? 'wallet connected' : 'connect wallet',
                      description: account?.account
                        ? `Account ID: ${reduceToken(account.account)}`
                        : 'Connect a wallet using one of the methods below',
                      content: <ConnectWalletModal />,
                    });
                  } else {
                    modalContext.openModal({
                      title: account?.account ? 'wallet connected' : 'connect wallet',
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
