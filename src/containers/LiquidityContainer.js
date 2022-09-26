import React from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BoosterIcon } from '../assets';
import LiquidityMyLiquidityTable from '../components/liquidity/LiquidityMyLiquidityTable';
import LiquidityPoolsTable from '../components/liquidity/LiquidityPoolsTable';
import LiquidityRewardsTable from '../components/liquidity/LiquidityRewardsTable';
import LiquidityTablesInfo from '../components/liquidity/LiquidityTablesInfo';
import LiquidityTokensTable from '../components/liquidity/LiquidityTokensTable';
import CustomButton from '../components/shared/CustomButton';
import { FlexContainer } from '../components/shared/FlexContainer';
import InfoPopup from '../components/shared/InfoPopup';
import Label from '../components/shared/Label';
import {
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
  ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED,
  ROUTE_LIQUIDITY_MY_LIQUIDITY,
  ROUTE_LIQUIDITY_POOLS,
  ROUTE_LIQUIDITY_REWARDS,
  ROUTE_LIQUIDITY_TOKENS,
} from '../router/routes';
import theme, { commonColors } from '../styles/theme';

const LiquidityContainer = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Liquidity providers earn a 0.25% fee back and 0.05% goes to stakers on all trades proportional to their share of the pool.
Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity."
        />
        <title>Kaddex | Liquidity</title>
      </Helmet>
      <FlexContainer
        className="column w-100 h-100 main"
        desktopStyle={{ paddingRight: theme.layout.desktopPadding, paddingLeft: theme.layout.desktopPadding }}
        tabletStyle={{ paddingRight: theme.layout.tabletPadding, paddingLeft: theme.layout.tabletPadding }}
        mobileStyle={{ paddingRight: theme.layout.mobilePadding, paddingLeft: theme.layout.mobilePadding }}
      >
        <FlexContainer className="w-100 justify-sb" mobileClassName="column" tabletClassName="column" style={{ marginBottom: 24 }}>
          <FlexContainer className="align-ce" gap={16} mobileStyle={{ marginBottom: 16 }} tabletStyle={{ marginBottom: 16 }}>
            <Label
              withShade={pathname !== ROUTE_LIQUIDITY_TOKENS}
              className="pointer"
              fontSize={24}
              fontFamily="syncopate"
              onClick={() => history.push(ROUTE_LIQUIDITY_TOKENS)}
            >
              TOKENS
            </Label>
            <Label
              withShade={pathname !== ROUTE_LIQUIDITY_POOLS}
              className="pointer"
              fontSize={24}
              fontFamily="syncopate"
              onClick={() => history.push(ROUTE_LIQUIDITY_POOLS)}
            >
              POOLS
            </Label>
            {(pathname === ROUTE_LIQUIDITY_TOKENS || pathname === ROUTE_LIQUIDITY_POOLS) && (
              <InfoPopup type="modal" title="Liquidity" containerStyle={{ marginLeft: 0 }}>
                <LiquidityTablesInfo pathname={pathname} />
              </InfoPopup>
            )}
          </FlexContainer>
          <FlexContainer gap={16} mobileClassName="column" mobilePixel={530}>
            <CustomButton
              fontSize={13}
              buttonStyle={{ height: 33 }}
              type={pathname === ROUTE_LIQUIDITY_REWARDS ? 'secondary' : 'primary'}
              color={commonColors.pink}
              onClick={() => history.push(ROUTE_LIQUIDITY_REWARDS)}
            >
              <RewardsButtonContent color={pathname === ROUTE_LIQUIDITY_REWARDS ? '#fff' : commonColors.pink}>
                <BoosterIcon />
                <Label fontFamily="syncopate" color={pathname === ROUTE_LIQUIDITY_REWARDS ? '#fff' : commonColors.pink} labelStyle={{ marginTop: 1 }}>
                  REWARDS
                </Label>
              </RewardsButtonContent>
            </CustomButton>
            <CustomButton
              fontSize={13}
              buttonStyle={{ height: 33 }}
              type={pathname === ROUTE_LIQUIDITY_MY_LIQUIDITY ? 'secondary' : 'primary'}
              fontFamily="syncopate"
              onClick={() => history.push(ROUTE_LIQUIDITY_MY_LIQUIDITY)}
            >
              MY LIQUIDITY
            </CustomButton>
            <CustomButton
              fontSize={13}
              buttonStyle={{ height: 33 }}
              type="gradient"
              fontFamily="syncopate"
              onClick={() =>
                history.push(
                  pathname === ROUTE_LIQUIDITY_TOKENS ? ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED : ROUTE_LIQUIDITY_ADD_LIQUIDITY_DOUBLE_SIDED,
                  { from: pathname }
                )
              }
            >
              ADD LIQUIDITY
            </CustomButton>
          </FlexContainer>
        </FlexContainer>
        {/* SINGLE SIDE TABLE */}
        {pathname === ROUTE_LIQUIDITY_TOKENS && <LiquidityTokensTable />}
        {/* DOUBLE SIDE TABLE */}
        {pathname === ROUTE_LIQUIDITY_POOLS && <LiquidityPoolsTable />}
        {/* MY LIQUIDITY TABLE */}
        {pathname === ROUTE_LIQUIDITY_MY_LIQUIDITY && <LiquidityMyLiquidityTable />}
        {/* MY LIQUIDITY TABLE */}
        {pathname === ROUTE_LIQUIDITY_REWARDS && <LiquidityRewardsTable />}
      </FlexContainer>
    </>
  );
};

export default LiquidityContainer;

const RewardsButtonContent = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 8px;
    path {
      fill: ${({ color }) => color};
    }
  }
`;
