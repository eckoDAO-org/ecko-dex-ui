import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import { PactContext } from '../../contexts/PactContext';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import Label from '../shared/Label';
import { humanReadableNumber } from '../../utils/reduceBalance';
import { FlexContainer } from '../shared/FlexContainer';

export const GraphCardHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    padding: 15px 0px 0px 15px;
  }
`;

const TVLChart = ({ kdaPrice, height }) => {
  const [viewedTVL, setViewedTVL] = useState(null);
  const [currentTVL, setCurrentTVL] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [tvlData, setTVLData] = useState([]);
  const pact = useContext(PactContext);

  const getTVL = useCallback(async () => {
    let totalTVL = 0;
    await pact.getPairList();
    if (Array.isArray(pact?.pairList)) {
      for (const pair of pact.pairList) {
        const token0Balance = Number(pair.reserves[0]?.decimal) || pair.reserves[0] || 0;
        const token1Balance = Number(pair.reserves[1]?.decimal) || pair.reserves[1] || 0;
        let token0price = 0;
        if (pair.token0 === 'KDA') {
          token0price = kdaPrice;
        } else if (pair.token1 === 'KDA') {
          token0price = (token0Balance / token1Balance) * kdaPrice;
        }
        let token1price = 0;
        if (pair.token1 === 'KDA') {
          token1price = kdaPrice;
        } else if (pair.token0 === 'KDA') {
          token1price = (token0Balance / token1Balance) * kdaPrice;
        }

        let token0USD = token0Balance * token0price;
        let token1USD = token1Balance * token1price;
        totalTVL += token0USD += token1USD;
      }
      setCurrentTVL(totalTVL);
      setViewedTVL(totalTVL);
    }
  }, [pact, kdaPrice]);

  useEffect(() => {
    getTVL();
  }, [getTVL]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_KADDEX_STATS_API_URL}/tvl/daily?dateStart=${moment()
          .subtract(90, 'days')
          .format('YYYY-MM-DD')}&dateEnd=${moment().format('YYYY-MM-DD')}`
      )
      .then(async (res) => {
        const allTVL = [];
        const kdaPrice = await pact.getCurrentKdaUSDPrice();
        for (const day of res.data) {
          allTVL.push({
            name: moment(day._id).format('DD/MM/YYYY'),
            tvl: +day.tvl
              .reduce((partialSum, currVol) => {
                if (currVol.tokenFrom === 'coin') {
                  const tokenToPrice = (currVol.tokenFromTVL / currVol.tokenToTVL) * kdaPrice;
                  return partialSum + currVol.tokenFromTVL * kdaPrice + currVol.tokenToTVL * tokenToPrice;
                } else {
                  const tokenFromPrice = (currVol.tokenToTVL / currVol.tokenFromTVL) * kdaPrice;
                  return partialSum + currVol.tokenFromTVL * tokenFromPrice + currVol.tokenToTVL * kdaPrice;
                }
              }, 0)
              .toFixed(2),
          });
        }
        setTVLData(allTVL);
      })
      .catch((err) => console.log('get tvl error', err));
  }, [pact]);

  return (
    <FlexContainer className="column align-ce w-100 h-100 background-fill" withGradient style={{ padding: 32 }}>
      <div className="column w-100">
        <Label fontSize={16}>TVL</Label>
        <Label fontSize={24}>$ {humanReadableNumber(Number(viewedTVL))}</Label>
        <Label fontSize={16}>{currentDate || moment().format('DD/MM/YYYY')}</Label>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart
            data={tvlData}
            onMouseMove={({ activePayload }) => {
              if (activePayload) {
                setViewedTVL((activePayload && activePayload[0]?.payload?.tvl) || '');
                setCurrentDate((activePayload && activePayload[0]?.payload?.name) || null);
              }
            }}
            onMouseLeave={() => {
              setViewedTVL(currentTVL);
              setCurrentDate(null);
            }}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 0,
            }}
          >
            <Tooltip label="TVL" content={() => ''} />
            <Line type="monotone" dataKey="tvl" stroke="#ED1CB5" activeDot={{ r: 5 }} dot={{ r: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </FlexContainer>
  );
};
export default TVLChart;
