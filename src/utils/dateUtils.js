const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septermber',
  'October', 'November', 'December'];
    
export const getDateFormTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()} - ${monthNames[date.getMonth()]} - ${date.getDate()}`;
};