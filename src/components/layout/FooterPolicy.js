import React from 'react';
import { NccLogo, NccLogoLightMode } from '../../assets';
import { useApplicationContext } from '../../contexts';
import { FlexContainer } from '../shared/FlexContainer';

const FooterPolicy = () => {
  //const [width] = useWindowSize();
  const { themeMode } = useApplicationContext();
  return (
    <FlexContainer
      className="justify-ce" //replace with justify-sb
      desktopStyle={{ margin: '0px 88px 24px' }}
      tabletStyle={{ margin: '0px 32px 24px' }}
      mobileStyle={{ margin: '0px 16px 24px' }}
    >
      {/* {width > commonTheme.mediaQueries.desktopPixel && <Label color="transparent" fontSize={12} labelStyle={{ minWidth: 259 }}></Label>} */}
      {/* {themeMode === 'dark' ? <NccLogo /> : <NccLogoLightMode />} */}
      {/* <Label
        fontSize={12}
        labelStyle={{
          display: width < commonTheme.mediaQueries.mobilePixel && 'flex',
          flexDirection: width < commonTheme.mediaQueries.mobilePixel && 'column',
          alignItems: width < commonTheme.mediaQueries.mobilePixel && 'flex-end',
          justifyContent: width < commonTheme.mediaQueries.mobilePixel && 'center',
        }}
      >
        <span
          className="pointer"
          style={{ marginBottom: width < commonTheme.mediaQueries.mobilePixel && 8 }}
          onClick={() => {
            window.open(`https://dex.ecko.finance/terms-of-use`, '_blank', 'noopener,noreferrer');
          }}
        >
          Terms & Conditions
        </span>
        <span style={{ display: width < commonTheme.mediaQueries.mobilePixel && 'none' }}>&nbsp;-&nbsp;</span>
        <span
          className="pointer"
          onClick={() => {
            window.open(`https://dex.ecko.finance/privacy-policy`, '_blank', 'noopener,noreferrer');
          }}
        >
          Privacy Policy
        </span>
      </Label> */}
    </FlexContainer>
  );
};

export default FooterPolicy;
