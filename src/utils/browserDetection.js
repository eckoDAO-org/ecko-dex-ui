const browserDetection = () => {
  if (navigator.brave) {
    return 'BRAVE';
  } else if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
    return 'OPERA';
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
    return 'CHROME';
  } else if (navigator.userAgent.indexOf('Safari') !== -1) {
    return 'SAFARI';
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    return 'FIREFOX';
  } else if (navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode === true) {
    //IF IE > 10
    return 'IE';
  } else {
    return 'UNKNOWN';
  }
};

export default browserDetection;
