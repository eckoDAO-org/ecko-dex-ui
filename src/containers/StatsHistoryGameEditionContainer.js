/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { PactContext } from '../contexts/PactContext';
import { FadeIn } from '../components/shared/animations';
import CommonTableGameEdition from '../components/shared/CommonTableGameEdition';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { extractDecimal, reduceBalance } from '../utils/reduceBalance';
import { NETWORK_TYPE } from '../constants/contextConstants';
import { GameEditionLoader } from '../components/shared/Loader';

export const CardContainer = styled(FadeIn)`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  padding: 16px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: ${`url(${modalBackground})`};
`;

const StatsHistoryGameEditionContainer = () => {
  const pact = useContext(PactContext);

  useEffect(() => {
    pact.getEventsSwapList();
  }, []);

  const renderColumns = () => {
    return [
      {
        name: 'pair',
        render: ({ item }) => `${item.token0}/${item.token1}`,
      },
      {
        renderName: ({ item }) => item.token0,
        render: ({ item }) => reduceBalance(item.reserves[0]),
      },
      {
        renderName: ({ item }) => item.token1,
        render: ({ item }) => reduceBalance(item.reserves[1]),
      },
      {
        name: 'rate',
        width: 160,
        render: ({ item }) => `${reduceBalance(extractDecimal(item.reserves[0]) / extractDecimal(item.reserves[1]))} ${item.token0}/${item.token1}`,
      },
    ];
  };
  return (
    <CardContainer>
      <FlexContainer className="w-100 justify-sb" style={{ marginBottom: 24 }} gameEditionStyle={{ marginBottom: 14 }}>
        <Label fontSize={24} geFontSize={32} fontFamily="syncopate">
          STATS
        </Label>
      </FlexContainer>
      {pact.pairList[0] ? (
        <CommonTableGameEdition
          id="swap-history-list"
          items={pact.pairList}
          columns={renderColumns()}
          onClick={(item) => {
            window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${item?.requestKey}`, '_blank', 'noopener,noreferrer');
          }}
        />
      ) : (
        <GameEditionLoader />
      )}
    </CardContainer>
  );
};

export default StatsHistoryGameEditionContainer;
