import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { KaddexLogo } from "../../../assets";
import { ROUTE_INDEX } from "../../../router/routes";
import menuItems from "../../menuItems";
import RightHeaderItems from "./RightHeaderItems";
import HeaderItem from "../../../shared/HeaderItem";
import { Checkbox } from "semantic-ui-react";

const Container = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  min-height: ${({ theme: { header } }) => `${header.height}px`};
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 25px;
  & > *:not(:last-child) {
    margin-right: 25px;
  }
`;

const RightContainer = styled.div`
  display: flex;
`;

const ToggleContainer = styled.div`
 font-family: ${({ theme: { fontFamily } }) => `${fontFamily.pressStartRegular}`};
 color:#ffffff;
 justify-content: center;

 span {
  vertical-align: text-bottom !important;
  margin-right: 4px;
 }
`

const DesktopHeader = ({ className,gameEditionView, setGameEditionView }) => {
  const history = useHistory();
  return (
    <Container className={className}>
      <LeftContainer>
        <KaddexLogo
          style={{ cursor: "pointer" }}
          onClick={() => history.push(ROUTE_INDEX)}
        />

        { !gameEditionView ? menuItems.map((item, index) => (
          <HeaderItem key={index} className={item.className} route={item.route}>
            {item.label}
          </HeaderItem>
        )) : (null)}
      <ToggleContainer>      
        <span>        
          Game Edition  
        </span>
        <Checkbox toggle onChange={()=>setGameEditionView(!gameEditionView)}/> 
      </ToggleContainer>
      </LeftContainer>
      <RightContainer>
        <RightHeaderItems />
      </RightContainer>
    </Container>
  );
};

export default DesktopHeader;
