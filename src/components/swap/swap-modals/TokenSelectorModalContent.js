import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import Search from '../../../components/shared/Search';
import { SwapContext } from '../../../contexts/SwapContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { PartialScrollableScrollSection } from '../../layout/Containers';
import useWindowSize from '../../../hooks/useWindowSize';
import theme from '../../../styles/theme';

const Label = styled.div`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => fontFamily.bold};
  text-transform: capitalize;
  text-align: left;
`;

const Divider = styled.div`
  border-top: ${({ theme: { colors } }) => `1px solid ${colors.white}99 `};
  margin: ${({ gameEditionView }) => (gameEditionView ? '0px' : '16px 0px')};
  opacity: ${({ gameEditionView }) => gameEditionView && 0.2};
  width: ${({ gameEditionView }) => (gameEditionView ? '450px' : '100%')};
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
`;

const TokensContainer = styled.div`
  display: flex;
  flex-flow: column;
  padding: ${({ gameEditionView }) => gameEditionView && '0px 15px'};

  & > div:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const TokenItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => fontFamily.regular};
  color: ${({ gameEditionView, selected, theme: { colors } }) => (selected ? `${colors.white}99` : colors.white)};
  svg {
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: ${({ gameEditionView }) => gameEditionView && '13px'};
  }
`;
const TokenSelectorModalContent = ({ show, tokenSelectorType, onTokenClick, onClose, fromToken, toToken }) => {
  const [searchValue, setSearchValue] = useState('');
  const swap = useContext(SwapContext);
  const { gameEditionView } = useContext(GameEditionContext);

  const [width] = useWindowSize();
  return (
    <Content>
      {!gameEditionView && <Label style={{ marginTop: 12, marginBottom: 8 }}>search token</Label>}

      <Search
        gameEditionView={gameEditionView}
        fluid
        placeholder="Search Token"
        value={searchValue}
        onChange={(e, { value }) => setSearchValue(value)}
      />
      {!gameEditionView && <Label style={{ marginBottom: '0px' }}>token</Label>}
      {!gameEditionView && <Divider />}
      <PartialScrollableScrollSection
        className="scrollbar-none"
        style={{
          width: '100%',
          maxHeight: gameEditionView && width < theme.mediaQueries.desktopPixel ? '534px' : '170px',
          marginTop: gameEditionView && '15px',
        }}
      >
        <TokensContainer gameEditionView={gameEditionView}>
          {Object.values(swap.tokenData)
            .filter((c) => {
              const code = c.code !== 'coin' ? c.code.split('.')[1] : c.code;
              return code.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) || c.name.toLowerCase().includes(searchValue?.toLowerCase());
            })
            .map((crypto) => {
              return (
                <>
                  <TokenItem
                    gameEditionView={gameEditionView}
                    key={crypto.name}
                    selected={fromToken === crypto.name || toToken === crypto.name}
                    style={{
                      cursor: fromToken === crypto.name || toToken === crypto.name ? 'default' : 'pointer',
                    }}
                    onClick={() => {
                      if (tokenSelectorType === 'from' && fromToken === crypto.name) return;
                      if (tokenSelectorType === 'to' && toToken === crypto.name) return;
                      if ((tokenSelectorType === 'from' && fromToken !== crypto.name) || (tokenSelectorType === 'to' && toToken !== crypto.name)) {
                        onTokenClick({ crypto });
                        setSearchValue('');
                        onClose();
                      }
                    }}
                  >
                    {crypto.icon}
                    {crypto.name}
                    {(tokenSelectorType === 'from' && fromToken === crypto.name) || (tokenSelectorType === 'to' && toToken === crypto.name) ? (
                      <Label gameEditionView={gameEditionView} style={{ marginLeft: 5 }}>
                        (Selected)
                      </Label>
                    ) : (
                      <></>
                    )}
                  </TokenItem>
                  {gameEditionView && <Divider gameEditionView={gameEditionView} />}
                </>
              );
            })}
        </TokensContainer>
      </PartialScrollableScrollSection>
    </Content>
  );
};

export default TokenSelectorModalContent;
