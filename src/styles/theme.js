export const commonTheme = {
  layout: {
    desktopPadding: 88,
    mobilePadding: 24,
  },
  header: {
    height: 65,
    mobileHeight: 91,
  },
  footer: {
    modalFooter: 57,
  },
  fontFamily: {
    regular: 'montserrat-regular',
    italic: 'montserrat-italic',
    bold: 'montserrat-bold',
    boldItalic: 'montserrat-bold-italic',
    pressStartRegular: 'press-start-regular',
    pixeboy: 'pixeboy',
    syncopate: 'syncopate-bold',
    basier: 'basier-square-mono-regular',
  },
  mediaQueries: {
    mobileBreakpoint: '48rem',
    mobileSmallPixel: 320,
    mobilePixel: 768,
    desktopPixel: 1024,
    gameEditionDesktopHeightPixel: 768,
    footerMinWidth: '50rem',
  },
  inputTokenWidth: 78,
  inputSelectButtonWidth: 81,
};

export const commonColors = {
  pink: '#D20790',
  purple: '#240B2F',
  black: '#000000',
  yellow: '#FEDE75',
  green: '#41CC41',
  error: '#DB2828',
  gameEditionYellow: '#FFC107',
  gameEditionBlue: '#6D99E4',
  gameEditionPink: '#F2248D',
  gameEditionWhiteGrey: '#FFFFFF80',
  gameEditionBlackGrey: '#00000080',
  gameEditionBlueGrey: '#5F7498',
};
export const lightTheme = {
  ...commonTheme,
  backgroundBody:
    'radial-gradient(at 90% 10%, hsla(298,34%,85%,1) 0, transparent 37%),radial-gradient(at 18% 73%, hsla(179,100%,94%,1) 0, transparent 71%),radial-gradient(at 81% 69%, hsla(40,100%,93%,1) 0, transparent 79%);',

  colors: {
    primary: '#FFFFFF',
    border: '#240B2F',
    white: '#212750',
    ...commonColors,
  },
  buttonBackgroundGradient: '#212750',
  backgroundInput: '#2127501A',
  backgroundContainer: '#F7F7F7',
};

export const darkTheme = {
  ...commonTheme,
  backgroundBody: '#0A0B1D',
  colors: {
    primary: '#212750',
    border: '#ECEBEC',
    white: '#FFFFFF',
    ...commonColors,
  },
  buttonBackgroundGradient: 'rgb(17,8,23)',
  backgroundInput: 'transparent',
  backgroundContainer: '#292A45',
};

export const theme = (mode = 'light') => {
  return mode === 'light' ? lightTheme : darkTheme;
};

export default theme();
