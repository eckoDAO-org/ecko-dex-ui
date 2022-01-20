import React, { useState, useContext, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import { SwapContext } from '../../../contexts/SwapContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';
import PixeledTokenSelectorBlueIcon from '../../../assets/images/game-edition/pixeled-token-selector-blue.svg';
import PixeledTokenSelectorWhiteIcon from '../../../assets/images/game-edition/pixeled-token-selector-white.svg';
import { PixeledArrowDownIcon, TreeDotsHorizontalIcon } from '../../../assets';

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
    margin-right: 50px;
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
  }
  .tree-dots {
    path {
      fill: ${({ selected }) => (selected ? '#000000' : '#ffffff')};
    }
  }
`;

const IconContainer = styled.div`
  margin-bottom: 10px;
  .rotated {
    transform: rotate(180deg);
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
  cursor: pointer;
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

  const swap = useContext(SwapContext);

  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(1);
  const { setShowTokens, setButtons } = useContext(GameEditionContext);

  const cryptoCurrencies = Object.values(swap.tokenData)
    .filter((c) => {
      const code = c.code !== 'coin' ? c.code.split('.')[1] : c.code;
      return code.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase()) || c.name.toLowerCase().includes(searchValue?.toLowerCase());
    })
    ?.map((c) => c);

  useEffect(() => {
    setButtons({
      Right: () => onSelectToken('right'),
      Left: () => onSelectToken('left'),
      B: () => {
        if (!selectedToken) {
          setShowTokens(true);
        }
      },
    });
    if (selectedTokenIndex < cryptoCurrencies.length) {
      setSelectedToken(cryptoCurrencies[selectedTokenIndex]);
    } else {
      setSelectedToken(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTokenIndex, selectedToken]);

  const onSelectToken = (direction) => {
    if (direction === 'right' && selectedTokenIndex + 1 <= cryptoCurrencies.length) {
      setSelectedTokenIndex((prev) => prev + 1);
      setTranslateX((prev) => prev - 150);
    }
    if (direction === 'left' && selectedTokenIndex - 1 >= 0) {
      setSelectedTokenIndex((prev) => prev - 1);

      setTranslateX((prev) => prev + 150);
    }
  };

  return (
    <Content>
      <IconContainer>
        <PixeledArrowDownIcon />
      </IconContainer>
      <TokensContainer translateX={translateX}>
        {cryptoCurrencies.map((crypto, i) => {
          return (
            <TokenItem
              isVisible={selectedTokenIndex - 1 <= i && selectedTokenIndex + 1 >= i}
              key={crypto.name}
              selected={selectedToken?.name === crypto.name}
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
              <PixeledTokenSelectorContainer selected={selectedToken?.name === crypto.name}>{crypto.icon}</PixeledTokenSelectorContainer>
              {crypto.name}
            </TokenItem>
          );
        })}
        <TokenItem
          isVisible={selectedTokenIndex - 1 <= cryptoCurrencies.length && selectedTokenIndex + 1 >= cryptoCurrencies.length}
          key="MORE"
          selected={!selectedToken}
          onClick={() => {
            setShowTokens(true);
          }}
        >
          <PixeledTokenSelectorContainer selected={selectedToken?.name === crypto.name}>
            <TreeDotsHorizontalIcon className="tree-dots" />
          </PixeledTokenSelectorContainer>
          MORE
        </TokenItem>
      </TokensContainer>
      <IconContainer>
        <PixeledArrowDownIcon className="rotated" />
      </IconContainer>
    </Content>
  );
};

export default TokenSelectorModalContent;
