import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import Search from '../../../shared/Search';
import { SwapContext } from '../../../contexts/SwapContext';
import { GameEditionContext } from '../../../contexts/GameEditionContext';

const Label = styled.div`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.bold};
  text-transform: capitalize;
  text-align: left;
`;

const Divider = styled.div`
  border-top: ${({ theme: { colors }, gameEditionView }) =>
    gameEditionView
      ? `1px dashed ${({ theme: { colors } }) => colors.black}`
      : `1px solid ${({ theme: { colors } }) => colors.white}99 `};
  margin: 16px 0px;
  width: 100%;
`;

const Content = styled.div`
  display: block;
  padding: 16px 0px;
`;

const TokensContainer = styled.div`
  display: flex;
  flex-flow: column;

  & > div:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const TokenItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  /* font-weight: ${({ active }) => (active ? 'bold' : 'normal')}; */
  font-family: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? fontFamily.pressStartRegular : fontFamily.regular};
  color: ${({ gameEditionView, selected, theme: { colors } }) =>
    gameEditionView
      ? selected
        ? `${colors.black}99`
        : colors.black
      : selected
      ? `${colors.white}99`
      : colors.white};
  svg {
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
`;
const TokenSelectorModalContent = ({
  show,
  // selectedToken,
  tokenSelectorType,
  onTokenClick,
  onClose,
  fromToken,
  toToken,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const swap = useContext(SwapContext);
  const { gameEditionView } = useContext(GameEditionContext);

  return (
    <Content>
      <Label
        gameEditionView={gameEditionView}
        style={{ marginTop: 16, marginBottom: 8 }}
      >
        search token
      </Label>
      <Search
        gameEditionView={gameEditionView}
        fluid
        // containerStyle={{ }}
        placeholder='Search'
        value={searchValue}
        onChange={(e, { value }) => setSearchValue(value)}
      />
      <Label gameEditionView={gameEditionView} style={{ marginBottom: '0px' }}>
        token
      </Label>
      <Divider gameEditionView={gameEditionView} />
      <TokensContainer>
        {Object.values(swap.tokenData)
          .filter((c) => {
            const code = c.code !== 'coin' ? c.code.split('.')[1] : c.code;
            return (
              code
                .toLocaleLowerCase()
                .includes(searchValue?.toLocaleLowerCase()) ||
              c.name.toLowerCase().includes(searchValue?.toLowerCase())
            );
          })
          .map((crypto) => {
            return (
              <TokenItem
                gameEditionView={gameEditionView}
                key={crypto.name}
                // active={
                //   selectedToken === crypto.name ||
                //   fromToken === crypto.name ||
                //   toToken === crypto.name
                // }
                // active={selectedToken === crypto.name}
                // selected={selectedToken === crypto.name}
                selected={fromToken === crypto.name || toToken === crypto.name}
                style={{
                  cursor:
                    fromToken === crypto.name || toToken === crypto.name
                      ? 'default'
                      : 'pointer',
                }}
                onClick={() => {
                  if (tokenSelectorType === 'from' && fromToken === crypto.name)
                    return;
                  if (tokenSelectorType === 'to' && toToken === crypto.name)
                    return;
                  if (
                    (tokenSelectorType === 'from' &&
                      fromToken !== crypto.name) ||
                    (tokenSelectorType === 'to' && toToken !== crypto.name)
                  ) {
                    onTokenClick({ crypto });
                    setSearchValue('');
                    onClose();
                  }
                }}
              >
                {crypto.icon}
                {crypto.name}
                {(tokenSelectorType === 'from' && fromToken === crypto.name) ||
                (tokenSelectorType === 'to' && toToken === crypto.name) ? (
                  <Label
                    gameEditionView={gameEditionView}
                    style={{ marginLeft: 5 }}
                  >
                    (Selected)
                  </Label>
                ) : (
                  <></>
                )}
                {/* <span
                  style={{
                    marginLeft: 'auto',
                    marginRight: 1,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {crypto.balance
                    ? `${reduceBalance(crypto.balance).toFixed(
                        crypto.precision
                      )} ${crypto.name}`
                    : ''}
                </span> */}
              </TokenItem>
            );
          })}
      </TokensContainer>
    </Content>
  );
};

export default TokenSelectorModalContent;
