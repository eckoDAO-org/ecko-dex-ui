import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import Search from '../../../components/shared/Search';
import { SwapContext } from '../../../contexts/SwapContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import { PartialScrollableScrollSection } from '../../layout/Containers';
import useWindowSize from '../../../hooks/useWindowSize';
import theme from '../../../styles/theme';
import PixeledTokenSelectorIcon from '../../../assets/images/game-edition/pixeled-token-selector.svg';
import PixeledTokenSelector from '../../../assets/images/game-edition/pixeled-token-selector.png';

const Content = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const TokensContainer = styled.div`
  display: flex;
  flex-flow: row;

  & > div:not(:last-child) {
    margin-right: 16px;
  }
`;
const PixeledTokenSelectorContainer = styled.div`
  min-height: 96px;
  min-width: 100px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: ${`url(${PixeledTokenSelectorIcon})`};
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 45px !important;
    height: 45px !important;
    margin-right: 0px !important;
  }
`;

const TokenItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: 38px;
  font-family: ${({ theme: { fontFamily }, gameEditionView }) => (gameEditionView ? fontFamily.pixeboy : fontFamily.regular)};
  color: ${({ gameEditionView, selected, theme: { colors } }) =>
    gameEditionView ? (selected ? `${colors.white}99` : colors.white) : selected ? `${colors.white}99` : colors.white};
  svg {
    /* margin-right: 8px; */
    align-items: center;
    justify-content: center;
    min-width: 50px;
    min-height: 50px;
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
      <PartialScrollableScrollSection
        className="scrollbar-none"
        style={{ width: '100%', maxHeight: gameEditionView && width < theme.mediaQueries.desktopPixel ? '534px' : '170px' }}
      >
        <TokensContainer>
          {Object.values(swap.tokenData)
            .filter((c) => {
              const code = c.code !== 'coin' ? c.code.split('.')[1] : c.code;
              return code.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) || c.name.toLowerCase().includes(searchValue?.toLowerCase());
            })
            .map((crypto) => {
              return (
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
                  <PixeledTokenSelectorContainer gameEditionView={gameEditionView}>{crypto.icon}</PixeledTokenSelectorContainer>
                  {crypto.name}
                </TokenItem>
              );
            })}
        </TokensContainer>
      </PartialScrollableScrollSection>
    </Content>
  );
};

export default TokenSelectorModalContent;
