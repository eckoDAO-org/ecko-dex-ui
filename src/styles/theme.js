export const commonTheme = {
  layout: {
    desktopWidth: '80%',
    mobileWidth: '95%',
    mainContentPadding: 24,
  },
  header: {
    height: 65,
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
  },
  mediaQueries: {
    mobileBreakpoint: '48rem',
    mobileSmallPixel: 320,
    mobilePixel: 768,
    desktopPixel: 1024,
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
};
export const lightTheme = {
  ...commonTheme,
  backgroundBody:
    'radial-gradient(at 90% 10%, hsla(298,34%,85%,1) 0, transparent 37%),radial-gradient(at 18% 73%, hsla(179,100%,94%,1) 0, transparent 71%),radial-gradient(at 81% 69%, hsla(40,100%,93%,1) 0, transparent 79%);',
  backgroundBodySafari:
    'radial-gradient(at 90% 10%, hsla(298,34%,85%,1) 0, transparent 100%),radial-gradient(at 18% 73%, hsla(179,100%,94%,1) 0, transparent 100%),radial-gradient(at 81% 69%, hsla(40,100%,93%,1) 0, transparent 100%);',
  colors: {
    primary: '#FFFFFF',
    border: '#240B2F',
    white: '#212750',
    ...commonColors,
  },
  buttonBackgroundGradient: '#212750',
  backgroundRightModal: '#FFFFFF',
  backgroundInput: '#2127501A',
  backgroundContainer: '#FFFFFF',
};

export const darkTheme = {
  ...commonTheme,
  backgroundBody: 'transparent linear-gradient(122deg, #070610 0%, #212750 100%) 0% 0% no-repeat padding-box',
  backgroundBodySafari: 'transparent linear-gradient(122deg, #070610 0%, #212750 100%) 0% 0% no-repeat padding-box',
  colors: {
    primary: '#212750',
    border: '#ECEBEC',
    white: '#FFFFFF',
    ...commonColors,
  },
  buttonBackgroundGradient: '#FFFFFF',
  backgroundInput: 'transparent',
  backgroundContainer: 'transparent',
  backgroundRightModal: '#4E125A40',
};

export const theme = (mode = 'light') => {
  return mode === 'light' ? lightTheme : darkTheme;
};

export default theme();
