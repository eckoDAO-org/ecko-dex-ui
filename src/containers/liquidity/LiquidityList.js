/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { Loader, Button, Divider } from 'semantic-ui-react';
import CustomButton from '../../components/shared/CustomButton';
import TokenPair from './TokenPair';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { AccountContext } from '../../contexts/AccountContext';
import { theme } from '../../styles/theme';
import ModalContainer from '../../components/shared/ModalContainer';
import reduceToken from '../../utils/reduceToken';
import ConnectWalletModal from '../../components/modals/kdaModals/ConnectWalletModal';
import { ModalContext } from '../../contexts/ModalContext';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import GradientBorder from '../../components/shared/GradientBorder';
import { LightModeContext } from '../../contexts/LightModeContext';
import FormContainer from '../../components/shared/FormContainer';
import browserDetection from '../../utils/browserDetection';
import useWindowSize from '../../hooks/useWindowSize';
import LogoLoader from '../../components/shared/LogoLoader';
import ArcadeBackground from '../../assets/images/game-edition/arcade-background.png';
import Label from '../../components/shared/Label';

const Container = styled.div`
  display: flex;
  margin-top: ${({ $gameEditionView }) => ($gameEditionView ? '0px' : '24px')};
  margin-left: auto;
  margin-right: auto;
  height: ${({ $gameEditionView }) => $gameEditionView && '100%'};
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
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const LiquidityList = (props) => {
  const modalContext = useContext(ModalContext);
  const liquidity = useContext(LiquidityContext);
  const { account } = useContext(AccountContext);
  const { gameEditionView, openModal } = useContext(GameEditionContext);
  const { themeMode } = useContext(LightModeContext);
  const [activeIndex, setActiveIndex] = useState(null);
  const [accordionHeight, setAccordionHeight] = useState(null);

  useEffect(() => {
    liquidity.getPairListAccountBalance(account.account);
  }, [account.account]);

  useEffect(() => {
    if (browserDetection() === 'SAFARI') {
      const elem = document.getElementById(`form-container-content`)?.getBoundingClientRect();
      setAccordionHeight(elem?.height + (gameEditionView ? 32 : 64));
    }
  }, [activeIndex]);

  const [width] = useWindowSize();

  return (
    <Container $gameEditionView={gameEditionView}>
      <ModalContainer
        withoutRainbowBackground
        containerStyle={{
          maxHeight: !gameEditionView && '80vh',
          maxWidth: 900,
          minWidth: 0,
          overflow: 'auto',
          border: 'none',
          boxShadow: 'none',
          height: gameEditionView && '100%',
          display: gameEditionView && 'flex',
          flexDirection: gameEditionView && 'column',
          backgroundRepeat: gameEditionView && 'no-repeat',
          backgroundPosition: gameEditionView && 'center',
          backgroundSize: gameEditionView && 'cover',
          backgroundImage: gameEditionView && `url(${ArcadeBackground})`,
        }}
      >
        {gameEditionView && (
          <Label geFontSize={52} geCenter geLabelStyle={{ textTransform: 'uppercase' }}>
            Pool
          </Label>
        )}

        <Label
          fontSize={24}
          geFontSize={20}
          geColor={'yellow'}
          geCenter
          geLabelStyle={{ marginBottom: '14px' }}
          labelStyle={{ marginBottom: '14px' }}
          fontFamily="bold"
        >
          Liquidity provider rewards
        </Label>
        <Label fontSize={16} geFontSize={18} geColor={'blue'} geCenter geLabelStyle={{ padding: '0px 10px' }}>
          Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool.
          <br />
          Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
        </Label>
        {account.account !== null ? (
          <BottomContainer $gameEditionView={gameEditionView}>
            <Label
              fontSize={32}
              geFontSize={20}
              geCenter
              geLabelStyle={{ margin: '10px 0px' }}
              labelStyle={{ margin: '30px 0px 14px' }}
              fontFamily="bold"
            >
              Your Liquidity
            </Label>
            <Button.Group
              fluid
              style={{
                marginBottom: gameEditionView ? 15 : 30,
                flexDirection: gameEditionView && width <= theme().mediaQueries.mobilePixel ? 'column' : 'row',
              }}
            >
              <CustomButton
                disabled
                buttonStyle={{
                  marginRight: gameEditionView && width <= theme().mediaQueries.mobilePixel ? '0px' : '15px',
                  borderRadius: '20px',
                  width: gameEditionView && width <= theme().mediaQueries.mobilePixel ? '100%' : '48%',
                  marginBottom: gameEditionView && width <= theme().mediaQueries.mobilePixel && '10px',
                }}
                onClick={() => props.selectCreatePair()}
              >
                Create a pair
              </CustomButton>
              <CustomButton
                buttonStyle={{
                  marginLeft: gameEditionView && width <= theme().mediaQueries.mobilePixel ? '0px' : '-5px',
                  borderRadius: '20px',
                  width: gameEditionView && width <= theme().mediaQueries.mobilePixel ? '100%' : '48%',
                }}
                onClick={() => props.selectAddLiquidity()}
              >
                Add Liquidity
              </CustomButton>
            </Button.Group>
            {account.account !== null ? (
              liquidity.pairListAccount[0] ? (
                liquidity.pairListAccount[0]?.balance ? (
                  <FormContainer
                    $gameEditionView={gameEditionView}
                    containerStyle={{ padding: gameEditionView && 16, minHeight: accordionHeight }}
                    withGameEditionBorder
                  >
                    {!gameEditionView && <GradientBorder />}
                    {Object.values(liquidity.pairListAccount).map((pair, index) => {
                      return pair && pair.balance ? (
                        <div id={`token-pair-${index}`}>
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
                                  ? `1px dashed ${theme(themeMode).colors.white}`
                                  : `1px solid  ${theme(themeMode).colors.white}99`,
                              }}
                            />
                          )}
                        </div>
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
                        fontFamily: gameEditionView ? theme(themeMode).fontFamily.pixeboy : theme(themeMode).fontFamily.regular,
                        textAlign: 'center',
                      }}
                    >
                      An error was encountered. Please reload the page
                    </p>
                  ) : (
                    <>
                      {browserDetection() === 'SAFARI' ? (
                        <Loader
                          active
                          inline="centered"
                          style={{
                            color: theme(themeMode).colors.white,
                            fontFamily: gameEditionView ? theme(themeMode).fontFamily.pixeboy : theme(themeMode).fontFamily.regular,
                          }}
                        />
                      ) : (
                        <LogoLoader />
                      )}
                    </>
                  )}
                </FormContainer>
              )
            ) : (
              <></>
            )}
          </BottomContainer>
        ) : (
          <ButtonContainer
            $gameEditionView={gameEditionView}
            style={{
              marginTop: 16,
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
