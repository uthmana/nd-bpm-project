import { entryPages } from './constant';
export function isEntryPage(pathname: string) {
  let entryPage = false;
  entryPages.map((page: string) => {
    if (pathname.includes(page)) {
      return (entryPage = true);
    }
  });
  return entryPage;
}

export const formatDateTime = (data) => {
  return new Date(data).toLocaleString('tr-TR')?.slice(0, -3);
};

export function datesPasted(dateToCompare) {
  const now: any = new Date();
  const targetDate: any = new Date(dateToCompare);

  const timeDifference = now - targetDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} saniye`;
  } else if (minutes < 60) {
    return `${minutes} dakika`;
  } else if (hours < 24) {
    return `${hours} saat`;
  } else if (days < 7) {
    return `${days} gün`;
  } else if (weeks < 4) {
    return `${weeks} hafta`;
  } else if (months < 12) {
    return `${months} ay`;
  } else {
    return `${years} yıl`;
  }
}

export const convertToISO8601 = (dateString) => {
  if (!dateString) return null;
  const parsedDate = new Date(dateString);
  const iso8601Date = parsedDate.toISOString();
  return iso8601Date;
};

export const removeMillisecondsAndUTC = (iso8601Date) => {
  if (!iso8601Date) return null;
  const trimmedDate = iso8601Date.slice(0, -5); // Remove milliseconds and 'Z'
  return trimmedDate;
};
