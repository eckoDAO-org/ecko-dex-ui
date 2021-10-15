import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import HeaderItem from '../../shared/HeaderItem';
import theme from '../../styles/theme';
import headerLinks from '../headerLinks';
import menuItems from '../menuItems';
import { FadeIn } from "../shared/animations";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const TopListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  & > *:not(:last-child) {
    margin-bottom: 25px;
  }
`;

const BottomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > *:not(:last-child) {
    margin-bottom: 25px;
  }
`;

const AnimatedDiv = styled.div`
  div {
    display: ${({ isEndend }) => isEndend && "none"};
  }
  div.in {
    animation: in 3s linear;
  }

  @keyframes in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  div.out {
    animation: out 3s;
  }

  @keyframes out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  span{
    font: normal normal normal 64px/77px ${theme.fontFamily.pressStartRegular};
    letter-spacing: 0.64px;
    color: #000000;
    opacity: 1;
  }
`;
const GameEditionMenuContainer = () => {
  const [fade, setFade] = useState({ state: "in", isEnded: false });

  useEffect(() => {
    if (fade.state === "out") {
      setTimeout(() => {
        setFade((prev) => ({ ...prev, isEnded: true }));
      }, [2500]);
    }
  }, [fade.state]);
    return (
      <Container>
      <AnimatedDiv isEndend={fade.isEnded}>
          <div
            className={fade.state}
            onAnimationEnd={() => {
              console.log("end");

              setFade({
                state: "out",
              });
            }}
          >
            <span>KADDEX</span>
          </div>
        </AnimatedDiv>
        {fade.isEnded &&
        <FadeIn>
          <TopListContainer>
          {menuItems.map((item, index) => (
            <HeaderItem key={index} className={item.className} route={item.route} headerItemStyle={{fontFamily: theme.fontFamily.pressStartRegular,color:'black'}}>
              {item.label}
            </HeaderItem>
          ))}
          </TopListContainer>
          <BottomListContainer>
          {headerLinks.map((item, index) => (
          <HeaderItem
            className={item?.className}
            route={item?.route}
            key={index}
            onClick={item?.onClick}
            link={item?.link}
            headerItemStyle={{fontFamily: theme.fontFamily.pressStartRegular,color:'black'}}
          >
            {item.label}
          </HeaderItem>
        ))}
          </BottomListContainer>
        </FadeIn>}
        </Container>
    );
};

export default GameEditionMenuContainer;