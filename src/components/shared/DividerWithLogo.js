import React from 'react';
import styled from 'styled-components/macro';
import { SwapArrowsIcon } from '../../assets';

const Container = styled.div`
  .divider {
    display: flex;

    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;

    &:before {
      position: absolute;
      content: '';
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background: #ffffff99;
      opacity: 1;
    }
    &:after {
      border: 1px solid #ffffff99;
      border-radius: 100%;
      position: absolute;
      content: '';
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      width: 32px;
      height: 32px;
      background-color: #4c125a;
      z-index: 10;
      justify-content: center;
    }
    span {
      position: relative;
      display: flex;
      align-content: center;
      z-index: 20;
      padding: 4px;
      padding-top: 5px;
      svg {
        width: 25px;
        height: 25px;
        path {
          fill: #000;
        }
      }
    }
  }
`;

const DividerWithLogo = () => {
  return (
    <Container class="divider">
      <span>
        <SwapArrowsIcon />
      </span>
    </Container>
  );
};

export default DividerWithLogo;
