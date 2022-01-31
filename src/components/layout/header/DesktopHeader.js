import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { KaddexLightModeLogo, KaddexLogoWhite } from '../../../assets';
import { ROUTE_INDEX } from '../../../router/routes';
import menuItems from '../../menuItems';
import RightHeaderItems from './RightHeaderItems';
import HeaderItem from '../../../components/shared/HeaderItem';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { useApplicationContext, useGameEditionContext } from '../../../contexts';
import GameEditionModeButton from './GameEditionModeButton';
import useWindowSize from '../../../hooks/useWindowSize';

const Container = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  min-height: ${({ theme: { header } }) => `${header.height}px`};
  padding: 0 48px;
  padding-top: 16px;
  zoom: ${({ resolutionConfiguration }) => resolutionConfiguration && resolutionConfiguration['normal-mode'].scale};
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 25px;
  & > *:not(:last-child) {
    margin-right: 25px;
  }
  .fadeOut {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 1s, opacity 1s linear;
  }
  .fadeIn {
    visibility: visible;
    opacity: 1;
    transition: opacity 1s linear;
  }
`;

const RightContainer = styled.div`
  display: flex;
`;

const AnimatedDiv = styled.div`
  display: flex;
  align-items: center;
  & > *:not(:last-child) {
    margin-right: 24px;
  }
`;

const DesktopHeader = ({ className }) => {
  const history = useHistory();
  const [buttonHover, setButtonHover] = useState(null);
  const { gameEditionView } = useGameEditionContext();
  const { resolutionConfiguration } = useApplicationContext();

  const [width, height] = useWindowSize();
  const { themeMode } = useContext(ApplicationContext);
  return (
    <Container className={className} resolutionConfiguration={resolutionConfiguration}>
      <LeftContainer>
        {themeMode === 'dark' ? (
          <KaddexLogoWhite style={{ cursor: 'pointer', zIndex: 1 }} onClick={() => history.push(ROUTE_INDEX)} />
        ) : (
          <KaddexLightModeLogo style={{ cursor: 'pointer', zIndex: 1 }} onClick={() => history.push(ROUTE_INDEX)} />
        )}

        <AnimatedDiv className={gameEditionView ? 'fadeOut' : 'fadeIn'}>
          {menuItems.map((item, index) => (
            <HeaderItem
              key={index}
              className={item.className}
              headerItemStyle={{ width: 36 }}
              route={item.route}
              onMouseOver={() => setButtonHover(item.id)}
              onMouseLeave={() => setButtonHover(null)}
              isHover={buttonHover === item.id}
            >
              {item.label}
            </HeaderItem>
          ))}
        </AnimatedDiv>
      </LeftContainer>

      {width >= resolutionConfiguration?.width && height >= resolutionConfiguration?.height && <GameEditionModeButton />}

      <RightContainer>
        <RightHeaderItems />
      </RightContainer>
    </Container>
  );
};

export default DesktopHeader;
