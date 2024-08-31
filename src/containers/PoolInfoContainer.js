import React, { useCallback, useEffect, useRef, useState } from 'react';
import { commonColors, commonTheme, theme } from '../styles/theme';
import { CryptoContainer, FlexContainer } from '../components/shared/FlexContainer';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useApplicationContext, usePactContext } from '../contexts';
import Label from '../components/shared/Label';
import { getAnalyticsDexscanPoolDetails} from '../api/kaddex-analytics';
import AppLoader from '../components/shared/AppLoader';
import {
  ArrowBack,
  DiscordLogoIcon,
  GithubLogoIcon,
  TelegramLogoIcon,
  TwitterLogoIcon,
  VerifiedBoldLogo,
  WebsiteLogoIcon,
} from '../assets';
import CustomButton from '../components/shared/CustomButton';
import { ButtonContent } from 'semantic-ui-react';
import { humanReadableNumber } from '../utils/reduceBalance';
import GraphicPercentage from '../components/shared/GraphicPercentage';
import UsdKdaToggle from '../components/shared/UsdKdaToggle';
import TradingViewChart from '../components/charts/TradingViewChart';
import TransactionsTablePool from '../components/transactions/TransactionsTablePool';

import UsdKdaPrice from '../components/shared/UsdKdaPrice';
import { ROUTE_ANALYTICS_STATS, ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED, ROUTE_SWAP } from '../router/routes';
import Banner from '../components/layout/header/Banner';
import {DEFAULT_ICON_URL} from '../constants/cryptoCurrencies';

const formatSupplyInfo = (supply, token) => {
  if (supply === 0) {
    return '-';
  }

  return `${humanReadableNumber(supply)} ${token}`;
};

const MarketCapInfo  = ({supply, price, unit, fontSize=14}) => {
  if(supply ===0)
    return <Label fontSize={fontSize}> - </Label>
  else
    return <UsdKdaPrice fontSize={fontSize} value={supply*price} unit={unit} />
}

// Map of social key to logo icon
const socialIcons = {
  website: WebsiteLogoIcon,
  twitter: TwitterLogoIcon,
  discord: DiscordLogoIcon,
  telegram: TelegramLogoIcon,
  github: GithubLogoIcon,
};

const REFRESH_INTERVAL_IN_MS = 30000; // 30 seconds

const getSocialElement = (social) => {
  const Element = socialIcons[social.type];

  let style = { height: '24px', width: '24px' };

  if (social.type === 'github') {
    style = { ...style, color: 'white' };
  }

  return (
    <a key={social.type} href={social.url} target="_blank" rel="noopener noreferrer">
      <Element style={style} />
    </a>
  );
};

  const TokenPriceWidget = ({poolDetails, unit}) => {

    return <FlexContainer withGradient gap={8} className="relative column background-fill w-100" style={{ padding: 32, zIndex: 1 }}>

      <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
        Price
      </Label>
      <UsdKdaPrice fontSize={32} value={unit==="KDA"?poolDetails.priceKda:poolDetails.price} unit={unit} precision={poolDetails.token0Info.precision} />
      <FlexContainer gap={16}>
        <FlexContainer gap={8}>
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            24H
          </Label>
          <GraphicPercentage componentStyle={{ margin: 0 }} percentageValue={(unit==="KDA"?poolDetails.pricePercChange24hKda:poolDetails.pricePercChange24h) * 100} />
        </FlexContainer>
        <FlexContainer gap={8}>
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            7D
          </Label>
          <GraphicPercentage componentStyle={{ margin: 0 }} percentageValue={(unit==="KDA"?poolDetails.pricePercChange7dKda:poolDetails.pricePercChange7d) * 100} />
        </FlexContainer>
      </FlexContainer>
      <FlexContainer gap={12} className="column" style={{ marginTop: '16px' }}>
        <FlexContainer gap={4} className="column">
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            24H Volume
          </Label>
          <UsdKdaPrice value={unit==="KDA"?poolDetails.volume24hKda:poolDetails.volume24h} unit={unit} />
        </FlexContainer>
        <FlexContainer gap={4} className="column">
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            All Time Low
          </Label>
          <UsdKdaPrice value={unit==="KDA"?poolDetails.allTimeLowKda:poolDetails.allTimeLow} unit={unit} precision={poolDetails.token0Info.precision} />
        </FlexContainer>
        <FlexContainer gap={4} className="column">
          <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
            All Time High
          </Label>
          <UsdKdaPrice value={unit==="KDA"?poolDetails.allTimeHighKda:poolDetails.allTimeHigh} unit={unit} precision={poolDetails.token0Info.precision} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
};



  const TokenDetailsWidget = ({poolDetails, unit}) => {
    const price = unit==="KDA"?poolDetails.priceKda:poolDetails.price;

    return <FlexContainer withGradient gap={12} className="relative column background-fill w-100" style={{ padding: 32, zIndex: 1 }}>
      <Label fontSize={16}>Token Details</Label>
      <FlexContainer gap={6}>{poolDetails.socials.map((social) => getSocialElement(social))}</FlexContainer>
      <FlexContainer gap={4} className="column">
        <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
          Market Cap
        </Label>
        <MarketCapInfo supply={poolDetails.circulatingSupply} price={price} unit={unit} />
      </FlexContainer>
      <FlexContainer gap={4} className="column">
        <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
          Fully Diluted Market Cap
        </Label>
      <MarketCapInfo supply={poolDetails.totalSupply} price={price} unit={unit} />
      </FlexContainer>
      <FlexContainer gap={4} className="column">
        <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
          Circulating Supply
        </Label>
        <Label fontSize={14}>{formatSupplyInfo(poolDetails.circulatingSupply, poolDetails.token0.name)}</Label>
      </FlexContainer>
      <FlexContainer gap={4} className="column">
        <Label fontSize={14} color={commonColors.gameEditionBlueGrey}>
          Total Supply
        </Label>
        <Label fontSize={14}>{formatSupplyInfo(poolDetails.totalSupply, poolDetails.token0.name)}</Label>
      </FlexContainer>
    </FlexContainer>
  }


const PoolInfoContainer = () => {
  const history = useHistory();
  const { pool } = useParams();
  const { pathname, state } = useLocation();
  const pact = usePactContext();
  const { themeMode } = useApplicationContext();
  const [poolDetails, setPoolDetails] = useState();
  const [loading, setLoading] = useState(true);

  const [fromLocation, setFromLocation] = useState();
  const [hasErrors, setHasErrors] = useState(false);
  const timerRef = useRef(null);
  const [usdKda, setUsdKda] = useState(false); // False measn USD, while true means KDA => Default is USD

  const unit = usdKda?"KDA":"$";

  // Function to refresh pool details and transactions data
  const refreshData = useCallback(async () => {
    const poolDetails = getAnalyticsDexscanPoolDetails(pool);
    setPoolDetails((prev) => ({ ...prev, ...poolDetails }));
  }, [pool]);

  // Update the previous page for back navigation
  useEffect(() => {
    const locationState = state?.from;

    if (locationState) {
      setFromLocation(locationState);
    }
  }, [state]);

  // Set initial data
  useEffect(() => {
    const setInitData = async () => {
      try {
        if (pact?.tokensUsdPrice) {
          const dexscanPoolDetails =  await getAnalyticsDexscanPoolDetails(pool);
          const pairInfo = pact.allPairs[`${dexscanPoolDetails.token1.address}:${dexscanPoolDetails.token0.address}`];

          const token0Info = pact.allTokens[dexscanPoolDetails.token0.address];
          const token1Info = pact.allTokens[dexscanPoolDetails.token1.address];

          const data = {
            token0Info,
            token1Info,
            ...pairInfo,
            ...dexscanPoolDetails,
          };
          setPoolDetails(data);
          setLoading(false);
        }
      } catch (error) {
        setHasErrors(true);
        setLoading(false);
      }
    };

    setInitData();
  }, [pact.allPairs, pact.allTokens, pact?.tokensUsdPrice, pool]);

  // Set interval for data refresh
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(async () => await refreshData(), REFRESH_INTERVAL_IN_MS);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [refreshData]);

  if (loading) {
    return <AppLoader className="h-100 w-100 align-ce justify-ce" />;
  }

  if (hasErrors) {
    return (
      <div className="flex h-100 align-ce justify-ce">
        <Banner
          position="center"
          text={`Temporarily Unavailable: The ${pool.replace(
            ':',
            '/'
          )} pool analytics page is currently down for maintenance. We're working to restore it promptly.`}
        />
      </div>
    );
  }

  const header = (
    <FlexContainer className="w-100 align-ce justify-sb">
      <div className="flex w-100 align-ce">
        <ArrowBack
          className="arrow-back svg-app-color"
          style={{
            cursor: 'pointer',
            marginRight: '16px',
            justifyContent: 'center',
          }}
          onClick={() => history.push(fromLocation || ROUTE_ANALYTICS_STATS)}
        />
      <CryptoContainer style={{ marginRight: 8 }}>
        <img
          src={poolDetails.token0Info.icon}
          alt={poolDetails.token0.name}
          style={{ width: 20, height: 20 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_ICON_URL;
          }}
        />
      </CryptoContainer>
        <Label fontSize={24} fontFamily="syncopate" style={{ whiteSpace: 'nowrap' }}>
          <span>{`${poolDetails.token0.name}`}</span>
          <span style={{ padding: '0 8px', color: commonColors.gameEditionBlueGrey }}>/</span>
          <span style={{ color: commonColors.gameEditionBlueGrey }}>{poolDetails.token1.name}</span>
        </Label>
        <div style={{marginLeft:"auto"}}> <UsdKdaToggle initialState={false} onClick={setUsdKda} /> </div>
      </div>
      {!poolDetails.token0Info.isVerified && (
        <CustomButton
          fontSize={13}
          buttonStyle={{ height: 33, width: 'min-content' }}
          type={'secondary'}
          fontFamily="syncopate"
          onClick={() =>
            window.open(
              `https://docs.google.com/forms/d/e/1FAIpQLSfb_1LIY594I87WotLwD8SzmOte9gc9KT4_2y5z6ot5Wv46nw/viewform`,
              '_blank',
              'noopener,noreferrer'
            )
          }
        >
          <ButtonContent color={commonColors.white} className="flex">
            <VerifiedBoldLogo className={'svg-app-inverted-color'} />
            <Label fontFamily="syncopate" color={theme(themeMode).colors.primary} labelStyle={{ marginTop: 1 }}>
              VERIFY
            </Label>
          </ButtonContent>
        </CustomButton>
      )}
    </FlexContainer>
  );


  const actionButtons = (
    <>
      <CustomButton
        fontSize={13}
        buttonStyle={{ height: 33, width: 200 }}
        type="secondary"
        fontFamily="syncopate"
        onClick={() => history.push(ROUTE_SWAP.concat(`?token0=${poolDetails.token1.name}&token1=${poolDetails.token0.name}`), { from: pathname })}
      >
        SWAP
      </CustomButton>
      <CustomButton
        fontSize={13}
        buttonStyle={{ height: 33, width: 200 }}
        type="secondary"
        fontFamily="syncopate"
        onClick={() =>
          history.push(ROUTE_LIQUIDITY_ADD_LIQUIDITY_SINGLE_SIDED.concat(`?token0=${poolDetails.token0.name}&token1=${poolDetails.token1.name}`), {
            from: pathname,
          })
        }
      >
        ADD LIQUIDITY
      </CustomButton>
    </>
  );

  return (
    <FlexContainer
      className="column w-100 main"
      gap={24}
      desktopStyle={{ paddingRight: commonTheme.layout.desktopPadding, paddingLeft: commonTheme.layout.desktopPadding }}
      tabletStyle={{ paddingRight: commonTheme.layout.tabletPadding, paddingLeft: commonTheme.layout.tabletPadding }}
      mobileStyle={{ paddingRight: commonTheme.layout.mobilePadding, paddingLeft: commonTheme.layout.mobilePadding }}
    >
      {header}
      <FlexContainer gap={16} className="w-100 justify-sb" tabletClassName="column" mobileClassName="column">
        <TokenPriceWidget poolDetails={poolDetails}  unit={unit}/>
        <TokenDetailsWidget poolDetails={poolDetails}  unit={unit}/>
      </FlexContainer>
      <FlexContainer className="w-100" mobileClassName="justify-ce" tabletClassName="justify-fe" desktopClassName="justify-fe" gap={8}>
        {actionButtons}
      </FlexContainer>
      <FlexContainer withGradient className="w-100 justify-sb relative column background-fill" style={{ height: 600, zIndex: 1, padding: 0 }}>
        <TradingViewChart symbol={unit==="KDA"?poolDetails.symbolKda:poolDetails.symbol} />
      </FlexContainer>
      <TransactionsTablePool pool={pool} />
    </FlexContainer>
  );
};

export default PoolInfoContainer;
