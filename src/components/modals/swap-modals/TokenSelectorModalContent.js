import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import Search from '../../../components/shared/Search';
import { SwapContext } from '../../../contexts/SwapContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import Label from '../../shared/Label';
import { PartialScrollableScrollSection } from '../../layout/Containers';
import useWindowSize from '../../../hooks/useWindowSize';
import { theme } from '../../../styles/theme';
import { CloseIcon } from '../../../assets';

const Divider = styled.div`
  border-top: ${({ theme: { colors } }) => `1px solid ${colors.white}99 `};
  margin: ${({ gameEditionView }) => (gameEditionView ? '0px' : '16px 0px')};
  opacity: ${({ gameEditionView }) => gameEditionView && 0.2};
  width: ${({ gameEditionView }) => (gameEditionView ? '400px' : '100%')};
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  .close-icon {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }

  input::placeholder {
    color: ${({ theme: { colors } }) => colors.white} !important;
  }
`;

const TokensContainer = styled.div`
  display: flex;
  flex-flow: column;
  padding: ${({ gameEditionView }) => gameEditionView && '0px 60px 0px 15px'};

  & > div:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const TokenItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  color: ${({ selected, theme: { colors } }) => (selected ? `${colors.white}99` : colors.white)};
  svg {
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: ${({ gameEditionView }) => gameEditionView && '13px'};
  }
`;
const TokenSelectorModalContent = ({ tokenSelectorType, onTokenClick, onClose, fromToken, toToken }) => {
  const [searchValue, setSearchValue] = useState('');
  const swap = useContext(SwapContext);
  const { gameEditionView, showTokens, setOutsideToken, setShowTokens, onCloseTokensList } = useContext(GameEditionContext);
  const { themeMode } = useContext(ApplicationContext);

  const [width] = useWindowSize();
  const cryptoCurrencies = Object.values(swap.tokenData).filter((c) => {
    const code = c.code !== 'coin' ? c.code.split('.')[1] : c.code;
    return code.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) || c.name.toLowerCase().includes(searchValue?.toLowerCase());
  });

  const onSelectToken = async (crypto) => {
    if (gameEditionView && showTokens) {
      await setOutsideToken((prev) => ({ ...prev, token: crypto }));
      await setShowTokens(false);
    }
    if (tokenSelectorType === 'from' && fromToken === crypto.name) return;
    if (tokenSelectorType === 'to' && toToken === crypto.name) return;
    if ((tokenSelectorType === 'from' && fromToken !== crypto.name) || (tokenSelectorType === 'to' && toToken !== crypto.name)) {
      onTokenClick({ crypto });
      setSearchValue('');
      onClose();
    }
  };
  return (
    <Content>
      {!gameEditionView && (
        <Label fontSize={13} fontFamily="bold" labelStyle={{ marginTop: 12, marginBottom: 8 }}>
          Search token
        </Label>
      )}

      <div style={{ display: 'flex' }}>
        <Search
          gameEditionView={gameEditionView}
          fluid
          placeholder="Search Token"
          value={searchValue}
          onChange={(e, { value }) => setSearchValue(value)}
        />
        {gameEditionView && (
          <CloseIcon
            className="close-icon"
            onClick={() => {
              onCloseTokensList();
            }}
            style={{ margin: '10px 0px 0px 40px', width: 14, height: 14, cursor: 'pointer' }}
          />
        )}
      </div>
      {!gameEditionView && (
        <Label fontSize={13} fontFamily="bold">
          Token
        </Label>
      )}
      {!gameEditionView && <Divider />}
      <PartialScrollableScrollSection
        className="scrollbar-none"
        style={{
          width: '100%',
          maxHeight: gameEditionView ? (width < theme().mediaQueries.desktopPixel ? '534px' : '400px') : '170px',
          marginTop: gameEditionView && '15px',
        }}
      >
        <TokensContainer gameEditionView={gameEditionView}>
          {cryptoCurrencies.length ? (
            cryptoCurrencies.map((crypto, i) => {
              return (
                <React.Fragment key={i}>
                  <TokenItem
                    gameEditionView={gameEditionView}
                    key={crypto.name}
                    selected={fromToken === crypto.name || toToken === crypto.name}
                    style={{
                      cursor: fromToken === crypto.name || toToken === crypto.name ? 'default' : 'pointer',
                    }}
                    onClick={async () => {
                      await onSelectToken(crypto);
                    }}
                  >
                    {crypto.icon}
                    {crypto.name}

                    {((tokenSelectorType === 'from' && fromToken === crypto.name) || (tokenSelectorType === 'to' && toToken === crypto.name)) && (
                      <Label fontSize={13} fontFamily="bold" labelStyle={{ marginLeft: 5 }}>
                        (Selected)
                      </Label>
                    )}
                  </TokenItem>
                  {gameEditionView && <Divider gameEditionView={gameEditionView} />}
                </React.Fragment>
              );
            })
          ) : (
            <>
              <div style={{ color: theme(themeMode).colors.white }}>Token not found</div>
              {gameEditionView && <Divider gameEditionView={gameEditionView} />}
            </>
          )}
        </TokensContainer>
      </PartialScrollableScrollSection>
    </Content>
  );
};

export default TokenSelectorModalContent;
