import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import GradientBorder from '../shared/GradientBorder';
import Label from '../shared/Label';
import { CardContainer } from '../stats/StatsTab';
import { BarChart, Bar, XAxis, Tooltip } from 'recharts';

const VolumeChart = () => {
  const [volume, setVolume] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/daily-volume?eventName=kswap.exchange.SWAP&dateStart=${moment()
          .subtract(60, 'days')
          .format('YYYY-MM-DD')}&dateEnd=${moment().format('YYYY-MM-DD')}`
      )
      .then((res) => {
        const allVolume = [];
        for (const day of res.data) {
          allVolume.push({
            name: moment(day._id).format('MM/DD'),
            'Volume KDA': day.volumes
              .reduce((partialSum, currVol) => {
                return partialSum + (currVol.tokenFromName === 'coin' ? currVol.tokenFromVolume : currVol.tokenToVolume);
              }, 0)
              .toFixed(2),
          });
        }
        setVolume(allVolume);
      })
      .catch((err) => console.log('get volume error', err));
  }, []);

  return (
    <CardContainer>
      <GradientBorder />
      <Label>Volume KDA</Label>
      <BarChart
        width={800}
        height={300}
        data={volume}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        {/* <YAxis /> */}
        <Tooltip label="Volume" />
        <Bar dataKey="Volume KDA" fill="#39fffc" />
      </BarChart>
    </CardContainer>
  );
};

export default VolumeChart;
