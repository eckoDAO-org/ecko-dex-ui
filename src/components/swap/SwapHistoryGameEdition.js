import moment from 'moment';
import React from 'react';
import styled from 'styled-components/macro';
import { NETWORK_TYPE } from '../../constants/contextConstants';
import useButtonScrollEvent from '../../hooks/useButtonScrollEvent';
import reduceToken from '../../utils/reduceToken';
import { getInfoCoin } from '../../utils/token-utils';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import { GameEditionLoader } from '../shared/Loader';

const GameEditionContainer = styled(FlexContainer)`
  padding: 24px;
  border: 2px dashed #fff;
  background: #ffffff1a;
  & > *:not(:last-child) {
    padding-bottom: 16px;
    border-bottom: 2px dashed #fff;
  }
  & > *:not(:first-child) {
    padding-top: 16px;
  }
`;

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 4px 0px;

  cursor: pointer;
`;

const SwapHistoryGameEdition = ({ items, loading }) => {
  useButtonScrollEvent('history-list');

  return (
    <FlexContainer className="relative w-100" gameEditionStyle={{ overflow: 'hidden' }}>
      {loading && <GameEditionLoader style={{ position: 'absolute', zIndex: 5, left: 0 }} />}

      <GameEditionContainer id="history-list" gameEditionClassName="column w-100 scrollbar-none" gameEditionStyle={{ overflowY: 'auto' }}>
        {items.map((item, i) => (
          <CustomGrid
            key={i}
            onClick={() => {
              window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${item?.requestKey}`, '_blank', 'noopener,noreferrer');
            }}
          >
            <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }} geColor="yellow">
              Swap Pair
            </Label>
            <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>
              {getInfoCoin(item, 3)?.name}/{getInfoCoin(item, 5)?.name}
            </Label>
            <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }} geColor="yellow">
              Date
            </Label>
            <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>
              {moment(item?.blockTime).format('DD/MM/YYYY HH:mm:ss')}
            </Label>
            <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }} geColor="yellow">
              Request Key
            </Label>
            <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>
              {reduceToken(item?.requestKey)}
            </Label>
            <Label geFontSize={20} geLabelStyle={{ textAlign: 'start', display: 'block' }} geColor="yellow">
              Amount
            </Label>
            <Label geFontSize={20} geLabelStyle={{ textAlign: 'end', display: 'block', whiteSpace: 'nowrap' }}>
              {item?.params[2]} {getInfoCoin(item, 3)?.name}
            </Label>
          </CustomGrid>
        ))}
      </GameEditionContainer>
    </FlexContainer>
  );
};

export default SwapHistoryGameEdition;
