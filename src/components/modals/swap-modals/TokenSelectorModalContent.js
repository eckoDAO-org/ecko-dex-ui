import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Search from '../../../components/shared/Search';
import Label from '../../shared/Label';
import { PartialScrollableScrollSection } from '../../layout/Containers';
import useWindowSize from '../../../hooks/useWindowSize';
import { theme } from '../../../styles/theme';
import { CloseIcon, VerifiedLogo } from '../../../assets';
import { useApplicationContext, useGameEditionContext, usePactContext } from '../../../contexts';

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
  font-family: ${({ theme: { fontFamily } }) => fontFamily.basier};
  color: ${({ selected, theme: { colors } }) => (selected ? `${colors.white}99` : colors.white)};
  svg {
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
  img {
    margin-right: 8px;
    width: 24px !important;
    height: 24px !important;
  }
  .svg-small {
    width: 16px;
    height: 16px;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: ${({ gameEditionView }) => gameEditionView && '13px'};
  }
`;
const TokenSelectorModalContent = ({ token, tokensToKeep, onSelectToken, onClose  }) => {
  const [searchValue, setSearchValue] = useState('');
  const pact = usePactContext();
  const { gameEditionView, onCloseTokensList } = useGameEditionContext();
  const { themeMode } = useApplicationContext();

  const [width] = useWindowSize();
  const cryptoCurrencies = Object.values(pact.allTokens).filter((c) => {
    const code = c.code !== 'coin' ? c.code.split('.')[1] : c.code;
    return code.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) || c.name.toLowerCase().includes(searchValue?.toLowerCase());
  });

  return (
    <Content>
      <div style={{ display: 'flex' }}>
        <Search gameEditionView={gameEditionView} fluid placeholder="Search" value={searchValue} onChange={(e, { value }) => setSearchValue(value)} />
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
        <Label fontSize={13} fontFamily="syncopate">
          Tokens
        </Label>
      )}
      {!gameEditionView && <Divider />}
      <PartialScrollableScrollSection
        style={{
          width: '100%',
          maxHeight: gameEditionView ? (width < theme().mediaQueries.desktopPixel ? '534px' : '400px') : '170px',
          marginTop: gameEditionView && '15px',
        }}
      >
        <TokensContainer gameEditionView={gameEditionView}>
          {cryptoCurrencies.length ? (
            cryptoCurrencies
              ?.filter((crypto) => (tokensToKeep ? tokensToKeep.includes(crypto.name) : crypto))
              .map((crypto, i) => {
                return (
                  <React.Fragment key={i}>
                    <TokenItem
                      gameEditionView={gameEditionView}
                      key={crypto.name}
                      selected={token === crypto.name}
                      style={{
                        cursor: token === crypto.name ? 'default' : 'pointer',
                      }}
                      onClick={async () => {
                        if (onSelectToken) {
                          await onSelectToken(crypto);
                        }
                        setSearchValue('');
                        if (onClose) {
                          onClose();
                        }
                      }}
                    >
                      <img
                        alt={`${crypto.name} icon`}
                        src={crypto.icon}
                        style={{ width: 24, height: 24, marginRight: '8px' }}
                      />
                      {crypto.name}

                      {token === crypto.name && (
                        <Label fontSize={13} fontFamily="syncopate" labelStyle={{ marginLeft: 5, lineHeight: 1 }}>
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
