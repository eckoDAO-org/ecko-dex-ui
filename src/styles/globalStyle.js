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
      background: transparent linear-gradient(122deg, #070610 0%, #4C125A 100%) 0% 0% no-repeat padding-box;
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
      width: 100%;
      display: flex;
      position: relative !important;
      background: transparent;
      border-radius: 10px;
      backdrop-filter: blur(50px) !important;
      opacity: 1 !important;
      border: 1px solid #FFFFFF99 !important;
      background-clip: padding-box !important;
      /* &:before {
        content: '';
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        z-index: -1000 !important;
        margin: -1px !important;
        border-radius: 10px !important;
        border-left: 1px solid #ed1cb5 !important;
        border-right: 1px solid #39fffc !important;
        background-image: linear-gradient(to right, #ed1cb5, #ffa900, #39fffc),
          linear-gradient(to right, #ed1cb5, #ffa900, #39fffc) !important;
        background-position: 0 0, 0 100% !important;
        background-size: 100% 1px !important;
        background-repeat: no-repeat !important;
      } */
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
