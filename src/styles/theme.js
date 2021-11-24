const commonTheme = {
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

export const lightTheme = {
  ...commonTheme,
  backgroundBody:
    'radial-gradient(at 90% 10%, hsla(298,34%,85%,1) 0, transparent 37%),radial-gradient(at 18% 73%, hsla(179,100%,94%,1) 0, transparent 71%),radial-gradient(at 81% 69%, hsla(40,100%,93%,1) 0, transparent 79%);',
  colors: {
    primary: '#FFFFFF',
    border: '#240B2F',
    pink: '#D20790',
    purple: '#240B2F',
    black: '#15081F',
    yellow: '#FEDE75',
    white: '#4C125A',
    error: '#DB2828',
  },
  buttonBackgroundGradient: '#4C125A',
  backgroundRightModal: '#FFFFFF',
  backgroundInput: '#4C125A1A',
  backgroundContainer: '#FFFFFF',
};

export const darkTheme = {
  ...commonTheme,
  backgroundBody:
    'transparent linear-gradient(122deg, #070610 0%, #4C125A 100%) 0% 0% no-repeat padding-box',
  colors: {
    primary: '#4C125A',
    border: '#ECEBEC',
    pink: '#D20790',
    purple: '#240B2F',
    black: '#15081F',
    yellow: '#FEDE75',
    white: '#FFFFFF',
    error: '#DB2828',
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
