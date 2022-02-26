import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import GradientBorder from '../shared/GradientBorder';
import Label from '../shared/Label';
import { CardContainer } from '../stats/StatsTab';

const TVLChart = () => {
  const [tvl, setTVL] = useState([]);

  const kdaPrice = 6.7;
  const fluxPrice = 0.293426;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/daily-tvl?eventName=kswap.exchange.UPDATE&dateStart=${'2021-10-30'}&dateEnd=${moment().format('YYYY-MM-DD')}`)
      .then((res) => {
        const allTVL = [];
        for (const day of res.data) {
          allTVL.push({
            name: moment(day._id).format('MM/DD'),
            tvl: day.tvl
              .reduce((partialSum, currVol) => {
                if (currVol.tokenFrom === 'coin') {
                  return partialSum + currVol.tokenFromTVL * kdaPrice + currVol.tokenToTVL * fluxPrice;
                } else {
                  return partialSum + currVol.tokenFromTVL * fluxPrice + currVol.tokenToTVL * kdaPrice;
                }
              }, 0)
              .toFixed(2),
          });
        }
        setTVL(allTVL);
      })
      .catch((err) => console.log('get tvl error', err));
  }, []);

  return (
    <CardContainer>
      <GradientBorder />
      <Label>TVL $USD</Label>
      <LineChart
        width={800}
        height={300}
        data={tvl}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip label="TVL" />
        <Line type="monotone" dataKey="tvl" stroke="#ffa900" activeDot={{ r: 1 }} dot={{ r: 0 }} />
      </LineChart>
    </CardContainer>
  );
};

export default TVLChart;
