/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useErrorState } from '../hooks/useErrorState';
import { getPairList } from '../api/pact';
import { FadeIn } from '../components/shared/animations';
import CommonTableGameEdition from '../components/shared/CommonTableGameEdition';
import { FlexContainer } from '../components/shared/FlexContainer';
import Label from '../components/shared/Label';
import modalBackground from '../assets/images/game-edition/modal-background.png';
import { extractDecimal, reduceBalance } from '../utils/reduceBalance';
import { NETWORK_TYPE } from '../constants/contextConstants';
import { GameEditionLoader } from '../components/shared/Loader';
import { usePactContext } from '../contexts';

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
  const { allPairs } = usePactContext();
  const [pairList, setPairList] = useErrorState([], true);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const resultPairList = await getPairList(allPairs);
    setPairList(resultPairList);
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  return (
    <CardContainer>
      <FlexContainer className="w-100 justify-sb" style={{ marginBottom: 24 }} gameEditionStyle={{ marginBottom: 14 }}>
        <Label fontSize={24} geFontSize={32} fontFamily="syncopate">
          STATS
        </Label>
      </FlexContainer>
      {!loading ? (
        <CommonTableGameEdition
          id="swap-history-list"
          items={Object.values(pairList)}
          columns={renderColumns()}
          onClick={(item) => {
            process.env.REACT_APP_KDA_NETWORK_TYPE !== 'development' &&
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
