import React from 'react';
import styled from 'styled-components/macro';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  .Toastify__toast {
    height: 88px;
    min-width: 370px;
    border-radius: 30px;
  }

  .Toastify__toast-container {
    @media (min-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel}px`}) {
      width: 520px;
    }
  }
  .Toastify__close-button {
    padding: 10px;
  }
  .Toastify__toast-container--bottom-right {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    width: auto;
  }
  .Toastify__toast--game-mode {
    background-color: #000000;
  }
  .Toastify__toast--success {
    background: ${({ theme: { colors } }) => colors.success};
  }

  .Toastify__progress-bar--success {
    background: ${({ theme: { colors } }) => colors.darkSuccess};
  }

  .Toastify__progress-bar--warning {
    background: ${({ theme: { colors } }) => colors.orange};
  }

  .Toastify__toast--warning {
    background: ${({ theme: { colors } }) => colors.warning};
  }

  .Toastify__progress-bar--error {
    background: ${({ theme: { colors } }) => colors.darkError};
  }

  .Toastify__toast--error {
    background: ${({ theme: { colors } }) => colors.secondaryColor};
  }
`;

const Notification = () => {
  return (
    <Container>
      <ToastContainer />
    </Container>
  );
};

export default Notification;
