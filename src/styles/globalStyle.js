import { createGlobalStyle, css } from 'styled-components/macro';

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
      font-family: ${({ theme: { fontFamily } }) => fontFamily.basier};
      color: ${({ theme: { colors } }) => colors.primary};
      background: ${({ theme: { backgroundBody } }) => backgroundBody};

      opacity: 1;
      overflow: hidden;
      ${({ themeMode }) => {
        return css`
          background-color: ${themeMode === 'light' ? '#F5F5F5' : '#13131A'};
        `;
      }}
    }
      

    #root {
      height: 100%;

      & > div:first-child {
        
        display: flex;
        flex-flow: column;
        height: 100%;
      }
    }

    .game-edition-input.ui.input>input{
      font-weight: 400;
      text-align: center;
      font-family:${({ theme: { fontFamily } }) => fontFamily.pixeboy};
      color: #000000 !important;
      background: transparent;
      border: unset;
    }

    .ui.input>input {
      background: transparent 0% 0% no-repeat padding-box;
      color: #fff;
      border-radius: 4px;
    }

    .ui.input>input:active, .ui.input>input:focus {
      background: transparent 0% 0% no-repeat padding-box;
      color: #fff;
      border: unset;
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
      @media (min-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel}px`}) {
        display: none !important;
      }
    }

    .desktop-only {
      @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.desktopPixel - 1}px`}) {
        display: none !important;
      }
    }
   

    .mobile-none {
      @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel - 1}px`}) {
        display: none !important;
      }
    }

    .mobile-only {
      @media (min-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel - 1}px`}) {
        display: none !important;
      }
    }

    .scrollbar-none {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */

      ::-webkit-scrollbar {
       display: none;
      }
      
    }

    .scrollbar-y-none {
      ::-webkit-scrollbar {
        width: 0px;
      }
    }

    .flex {
      display: flex;
    }

    .hide-scrollbar {
    scroll-behavior: smooth;
      ::-webkit-scrollbar {
        display: none;
      }
      scrollbar-width: none;
    }
    .pointer {
      cursor: pointer;
    }

    .scroll-mt {
      scroll-margin-top: 115px;
    }
    .align-fs {
      align-items: flex-start;
    }

    .align-fe {
      align-items: flex-end;
    }

    .align-ce {
      align-items: center;
    }

    .align-bl {
      align-items: baseline;
    }

    .justify-ce {
      justify-content: center;
    }

    .justify-sb {
      justify-content: space-between;
    }
    .justify-sa {
      justify-content: space-around;
    }

    .justify-fe {
      justify-content: flex-end;
    }

    .justify-fs {
      justify-content: flex-start;
    }

    .text-ce {
      text-align: center;
    }

    .absolute {
      position: absolute;
    }

    .fixed {
      position: fixed;
    }

    .relative {
      position: relative;
    }

    .w-100 {
      width: 100%;
    }
    .h-100 {
      height: 100%;
    }

    .w-50 {
      width: 50%;
    }
    .h-50 {
      height: 50%;
    }

    .flex-1 {
      flex: 1;
    }

    .h-fit-content {
      height: fit-content;
    }
    .w-fit-content {
      width: fit-content;
    }

    .column {
      display: flex;
      flex-direction: column;
    
    }


    .column-reverse {
      flex-direction: column-reverse;
    }

    .wrap {
      flex-wrap: wrap;
    }
    .no-wrap {
      white-space: nowrap;
    }

    .x-auto {
      overflow-x: auto;
    }
    .y-auto {
      overflow-y: auto;
    }

    .hidden {
      overflow: hidden;
    }

    .svg-app-color {
        path {
          fill: ${({ theme: { colors } }) => colors.white}!important;
        }
    }
    .svg-app-inverted-color {
        path {
          fill: ${({ theme: { colors } }) => colors.primary}!important;
        }
    }

    .svg-pink {
      path {
          fill: ${({ theme: { colors } }) => colors.pink}!important;
        }
    }

    .rotate-180{
      transform: rotate(180deg);
    }

    .main {
      padding-top: 32px;
      padding-bottom: 32px;
      @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel - 1}px`}) {
        padding-top: 24px;
        padding-bottom: 24px;
      }
    }

    .analytics-tvl-container {
      width: 50%;
      @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel - 1}px`}) {
        width: 100%;
      }
    }

    .analytics-volumes-container {
      width: 50%;
      @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel - 1}px`}) {
        width: 100%;
      }
    }
`;
