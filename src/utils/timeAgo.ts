export const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInWeek = secondsInDay * 7;
  const secondsInMonth = secondsInDay * 30;
  const secondsInYear = secondsInDay * 365;

  if (diffInSeconds < secondsInMinute) {
    return `${diffInSeconds}s`;
  } else if (diffInSeconds < secondsInHour) {
    return `${Math.floor(diffInSeconds / secondsInMinute)}m`;
  } else if (diffInSeconds < secondsInDay) {
    return `${Math.floor(diffInSeconds / secondsInHour)}h`;
  } else if (diffInSeconds < secondsInWeek) {
    return `${Math.floor(diffInSeconds / secondsInDay)}d`;
  } else if (diffInSeconds < secondsInMonth) {
    return `${Math.floor(diffInSeconds / secondsInWeek)}w`;
  } else if (diffInSeconds < secondsInYear) {
    return `${Math.floor(diffInSeconds / secondsInMonth)}mo`;
  } else {
    return `${Math.floor(diffInSeconds / secondsInYear)}y`;
  }
};
