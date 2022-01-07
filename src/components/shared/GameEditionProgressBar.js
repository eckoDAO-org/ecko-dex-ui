import React from 'react';
import styled from 'styled-components/macro';

const Container = styled.div`
  height: 20px;
  width: 110px;
  display: flex;
  flex-direction: column;
  margin-top: 34px;
  position: relative;
  .progress-bar-left-border {
    left: px;
  }
  .progress-bar-right-border {
    right: 0px;
  }
  .progress-bar-top-border {
    top: 0px;
    right: 3px;
  }
  .progress-bar-bottom-border {
    bottom: 0px;
    right: 3px;
  }
`;

const HorizontalBorder = styled.div`
  height: 3px;
  width: calc(100% - 6px);
  background-color: #ffff;
  position: absolute;
`;

const Row = styled.div`
  display: flex;
  height: 100%;
  padding: 3px 0;
  position: relative;
`;

const VerticalBorder = styled.div`
  width: 3px;
  height: calc(100% - 6px);
  background-color: #ffff;
  position: absolute;
`;

const Filler = styled.div`
  height: 9px;
  width: ${({ loadingValue }) => loadingValue}%;
  background-color: #74c04b;
  transition: width 1s ease-in-out;
  padding: 3px;
  position: absolute;
  left: 6px;
  top: 6px;
`;

const GameEditionProgressBar = ({ loadingValue }) => {
  return (
    <Container>
      <HorizontalBorder className="progress-bar-top-border" />
      <Row>
        <VerticalBorder className="progress-bar-left-border" />
        <Filler loadingValue={loadingValue} />
        <VerticalBorder className="progress-bar-right-border" />
      </Row>
      <HorizontalBorder className="progress-bar-bottom-border" />
    </Container>
  );
};

export default GameEditionProgressBar;
