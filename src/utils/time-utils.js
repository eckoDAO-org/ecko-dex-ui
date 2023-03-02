import moment from 'moment';

export const timeRender = (sec) => {
  if (sec > 86400) return moment.utc(1000 * sec).format('D[ days] H[ hours]');
  else if (sec > 3600) return moment.utc(1000 * sec).format('H[ hours]');
  else return moment.utc(1000 * sec).format('m[ minutes]');
};

// Function to convert UTC time in ISO-8601 format to seconds
export const convertUTCToSecond = (utc) => {
  const date = new Date(utc);

  return date.getTime() / 1000;
};
