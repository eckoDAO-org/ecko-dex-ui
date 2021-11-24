import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    *, *:before, *:after {
      -webkit-box-sizing: inherit;
      -moz-box-sizing: inherit;
      box-sizing: inherit;
    }

    *:focus {
      outline: none;
    }

    html {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    };

    body {
      margin: 0;
      width: 100%;
      height: 100%;
      line-height: inherit;
      overflow: auto;
      min-width: 0;
      font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
      color: ${({ theme: { colors } }) => colors.primary};
      background: ${({ theme: { backgroundBody } }) => backgroundBody};
      opacity: 1;
      background-size: cover;
      background-repeat: no-repeat;
    };

    #root {
      height: 100%;

      & > div:first-child {
        display: flex;
        flex-flow: column;
        height: 100%;
      }
    }
/* 
    .ui.dimmer {
      background-color: rgba(0,0,0,.40) !important;
    } */

    .ui.input>input {
      background: transparent 0% 0% no-repeat padding-box;
      color: #fff;
      border-radius: 4px;
    }

    .ui.input>input:active, .ui.input>input:focus {
      background: transparent 0% 0% no-repeat padding-box;
      color: #fff;
    }

    .ui.disabled.button {
      opacity: 1 !important;
    }

    .ui.popup {
      background:transparent;
      border:none;
      box-shadow:none;
      color:#FFFFFF;
    }

    #tsparticles canvas{
      z-index:-1 !important;
    }

    .desktop-none {
      @media (min-width: ${({ theme: { mediaQueries } }) =>
        `${mediaQueries.desktopPixel + 1}px`}) {
        display: none !important;
      }
    }

    .mobile-none {
      @media (max-width: ${({ theme: { mediaQueries } }) =>
        `${mediaQueries.desktopPixel}px`}) {
        display: none !important;
      }
    }

`;
