import React from 'react';
import { Equation } from 'react-equation';
import { EquationContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';

const UnstakeInfo = () => {
  return (
    <div className="colum">
      <Label>
        Unstaking your funds is always possible. To prevent smart contract manipulation and further reward long-term holders, an easy-to-understand
        penalty structure has been designed: • Unstaking during the first 72 hours will trigger a 3% flat penalty on your staked amount.
        <br />• Withdrawing your rewards during the first 60 days will result in an exponentially time-decreasing penalty on your accumulated rewards
        – your initial capital will not be affected.
        <br />
        Penalty Proportion Formula:
      </Label>
      <EquationContainer>
        <Equation className="equation" value="p(d) = max (0, ((60-d)/60)^0.66)" />
      </EquationContainer>

      <Label>
        where:
        <br />o p denotes the penalty proportion on rewards accumulated on the first 60 days;
        <br />o d is the number of days the user has kept their KDX staked;
        <br />o “60” is the minimum amount of days required to have no penalties;
        <br />o “0.66” is an arbitrary coefficient used to model the penalty-curve efficiently.
      </Label>

      <Label>• Adding more KDX to your stake, will simply increase your waiting time proportionally</Label>
      <Label>Waiting Time Formula: </Label>

      <EquationContainer>
        <Equation className="equation" value="w = (60*n + r*p)/(n+p)" />
      </EquationContainer>

      <Label>
        where:
        <br />o w denotes waiting time adjustment when adding more stake;
        <br />o r is the previous waiting time (user position in the penalty curve);
        <br />o p is the previous staked amount;
        <br />o n is the newly staked amount.
      </Label>
    </div>
  );
};

export default UnstakeInfo;
