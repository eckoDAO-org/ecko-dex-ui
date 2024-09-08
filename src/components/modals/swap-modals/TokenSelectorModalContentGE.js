import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import PixeledTokenSelectorBlueIcon from '../../../assets/images/game-edition/pixeled-token-selector-blue.svg';
import PixeledTokenSelectorWhiteIcon from '../../../assets/images/game-edition/pixeled-token-selector-white.svg';
import { PixeledArrowDownIcon, TreeDotsHorizontalIcon } from '../../../assets';
import GameEditionLabel from '../../game-edition-v2/components/GameEditionLabel';
import PressButtonToActionLabel from '../../game-edition-v2/components/PressButtonToActionLabel';
import { useGameEditionContext, usePactContext } from '../../../contexts';

const Content = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  max-width: 100%;
`;

const TokensContainer = styled.div`
  display: flex;
  flex-flow: row;
  transition: transform 0.5s;
  max-width: 100%;

  transform: ${({ translateX }) => `translateX(${translateX}px)`};

  & > div:not(:last-child) {
    margin-right: 60px;
  }
`;
const PixeledTokenSelectorContainer = styled.div`
  min-height: 96px;
  min-width: 100px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: ${({ selected }) => `url(${selected ? PixeledTokenSelectorWhiteIcon : PixeledTokenSelectorBlueIcon})`};
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 45px !important;
    height: 45px !important;
    margin-right: 0px !important;
    margin-bottom: 4px;
  }
  .tree-dots {
    path {
      fill: ${({ selected }) => (selected ? '#000000' : '#ffffff')};
    }
  }
`;

const IconContainer = styled.div`
  margin-bottom: 16px;
  .rotated {
    transform: rotate(180deg);
    margin-top: 16px;
    margin-bottom: 0px;
  }
  svg {
    width: 20px;
    height: 20px;

    path {
      fill: ${({ theme: { colors } }) => colors.gameEditionYellow};
    }
  }
`;

const TokenItem = styled.div`
  ${({ isVisible }) => {
    if (isVisible) {
      return css`
        visibility: visible;
        transition: visibility 0s 0.2s;
      `;
    } else {
      return css`
        visibility: hidden;
        transition: visibility 0s;
      `;
    }
  }}

  flex-flow: column;
  align-items: center;
  font-size: 38px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.pixeboy};
  color: ${({ selected, theme: { colors } }) => (selected ? colors.gameEditionYellow : '#ffffff99')};
  svg {
    align-items: center;
    justify-content: center;
    min-width: 50px;
    min-height: 50px;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: ${({ gameEditionView }) => gameEditionView && '13px'};
  }
`;
const TokenSelectorModalContent = ({ tokenSelectorType, onTokenClick, onClose, fromToken, toToken }) => {
  const [searchValue, setSearchValue] = useState('');
  const [translateX, setTranslateX] = useState(0);
  const pact = usePactContext();

  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(1);
  const { gameEditionView, setShowTokens, setButtons, setOutsideToken, showTokens } = useGameEditionContext();

  const cryptoCurrencies = Object.values(pact.allTokens)
    .filter((c) => {
      const code = c.code !== 'coin' ? c.code.split('.')[1] : c.code;
      return code.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) || c.name.toLowerCase().includes(searchValue?.toLowerCase());
    })
    ?.map((c) => c);

  const topThreeCrypto = cryptoCurrencies.filter((crypto, i) => i < 3);

  useEffect(() => {
    if (gameEditionView) {
      setButtons({
        Right: () => onSelectToken('right'),
        Left: () => onSelectToken('left'),
        A: () => {
          if (!selectedToken) {
            setOutsideToken({ token: null, tokenSelectorType, fromToken, toToken });
            setShowTokens(true);
          } else {
            onTokenSelect(selectedToken);
          }
        },
      });
      if (selectedTokenIndex < topThreeCrypto.length) {
        setSelectedToken(topThreeCrypto[selectedTokenIndex]);
      } else {
        setSelectedToken(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTokenIndex, selectedToken, gameEditionView]);

  const onSelectToken = (direction) => {
    if (direction === 'right' && selectedTokenIndex + 1 <= topThreeCrypto.length) {
      setSelectedTokenIndex((prev) => prev + 1);
      setTranslateX((prev) => prev - 160);
    }
    if (direction === 'left' && selectedTokenIndex - 1 >= 0) {
      setSelectedTokenIndex((prev) => prev - 1);

      setTranslateX((prev) => prev + 160);
    }
  };
  const onTokenSelect = (crypto) => {
    console.log('onTokenSelect', crypto);
    if (!showTokens) {
      if (tokenSelectorType === 'from' && fromToken === crypto.name) return;
      if (tokenSelectorType === 'to' && toToken === crypto.name) return;
      if ((tokenSelectorType === 'from' && fromToken !== crypto.name) || (tokenSelectorType === 'to' && toToken !== crypto.name)) {
        onTokenClick({ crypto });
        setSearchValue('');
        onClose();
      }
    }
  };

  return (
    <Content>
      <IconContainer>
        <PixeledArrowDownIcon />
      </IconContainer>
      <TokensContainer translateX={translateX}>
        {topThreeCrypto.map((crypto, i) => {
          return (
            <TokenItem
              isVisible={selectedTokenIndex - 1 <= i && selectedTokenIndex + 1 >= i}
              key={crypto.name}
              selected={selectedToken?.name === crypto.name}
              onClick={() => onTokenSelect(crypto)}
            >
              <PixeledTokenSelectorContainer selected={selectedToken?.name === crypto.name}>{crypto.icon}</PixeledTokenSelectorContainer>
              <GameEditionLabel fontSize={32} center color={selectedToken?.name === crypto.name ? 'yellow' : 'white'}>
                {crypto.name}
              </GameEditionLabel>
            </TokenItem>
          );
        })}
        <TokenItem
          isVisible={selectedTokenIndex - 1 <= topThreeCrypto.length && selectedTokenIndex + 1 >= topThreeCrypto.length}
          key="MORE"
          selected={!selectedToken}
          style={{ cursor: showTokens ? 'default' : 'pointer' }}
          onClick={() => {
            setOutsideToken({ token: null, tokenSelectorType, fromToken, toToken });
            setShowTokens(true);
          }}
        >
          <PixeledTokenSelectorContainer selected={!selectedToken}>
            <TreeDotsHorizontalIcon className="tree-dots" />
          </PixeledTokenSelectorContainer>

          <GameEditionLabel fontSize={32} center color={!selectedToken ? 'yellow' : 'white'}>
            MORE
          </GameEditionLabel>
        </TokenItem>
      </TokensContainer>
      <IconContainer>
        <PixeledArrowDownIcon className="rotated" />
      </IconContainer>

      <PressButtonToActionLabel actionLabel="select token" />
    </Content>
  );
};

export default TokenSelectorModalContent;
