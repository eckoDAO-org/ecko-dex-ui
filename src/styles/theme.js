export const commonTheme = {
  layout: {
    desktopPadding: 88,
    tabletPadding: 32,
    mobilePadding: 16,
  },
  header: {
    height: 65,
    mobileHeight: 65,
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
  grey: '#5C5C5C',
  error: '#DB2828',
  red: '#FF5757',
  redComponent: '#CC4141',
  active: '#2D6A18',
  closed: '#9D1D16',
  info: '#10C4DF',
  orange: '#FFA900',
  gold: '#DAAF37',
  appColor: '#212750',
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
    '#F4F4F4;',

  colors: {
    primary: '#FFFFFF',
    border: '#240B2F',
    white: '#212750',
    ...commonColors,
  },
  buttonBackgroundGradient: '#212750',
  backgroundInput: '#2127501A',
  backgroundContainer: '#F7F7F7',
  backgroundTableHighlight: '#E6E6E6',
  backgroundProgressBar: '#212750',
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
  backgroundContainer: '#1C1C24',
  backgroundTableHighlight: '#38395E',
  backgroundProgressBar: '#5C5C5C99',
};

export const theme = (mode = 'light') => {
  return mode === 'light' ? lightTheme : darkTheme;
};

export default theme();
