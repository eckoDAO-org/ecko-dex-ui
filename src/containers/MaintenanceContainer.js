/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import styled from "styled-components/macro";

const Container = styled.div`
  width: 100%;
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  width: 100%;
`;

const Title = styled.span`
  font-size: 25px;
  letter-spacing: 0px;
  color: #ffffff;
`;

const MaintenanceContainer = () => {
  return (
    <Container>
      <TitleContainer>
        <Title>
          <p>
            We have discovered a vulnerability of Kadenaswap code and are
            therefore pausing trading until this vulnerability is fixed by
            Kadena.
          </p>
          <p>
            This pause is also enacted in the smart contract protecting user
            funds. We are also working to fix this issue on our V2 platform.
          </p>
        </Title>
      </TitleContainer>
    </Container>
  );
};

export default MaintenanceContainer;
