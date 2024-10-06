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

export const generateSKU = (
  customerName: string,
  productName: string,
  quantity: number,
) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    second: '2-digit',
    minute: '2-digit',
    hour: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const formattedQuantity = quantity.toString().padStart(4, '0');
  const turkishToEnglishMapping: { [key: string]: string } = {
    ç: 'c',
    Ç: 'C',
    ğ: 'g',
    Ğ: 'G',
    ı: 'i',
    İ: 'I',
    ö: 'o',
    Ö: 'O',
    ş: 's',
    Ş: 'S',
    ü: 'u',
    Ü: 'U',
  };
  const cleanCustomerName = replaceTurkishCharacters(
    customerName,
    turkishToEnglishMapping,
  );
  const cleanProductName = replaceTurkishCharacters(
    productName,
    turkishToEnglishMapping,
  );

  const sku = `${cleanCustomerName.toUpperCase().slice(0, 3)}-${cleanProductName
    .toUpperCase()
    .slice(0, 2)}-${formattedQuantity}-${formattedDate
    .replaceAll('/', '')
    .replaceAll(':', '')
    .replace(',', '-')}`;
  return sku;
};

export const replaceTurkishCharacters = (
  str: string,
  mapping: { [key: string]: string },
) => {
  return str.replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => mapping[match]);
};

export const getMonthAndWeekDates = (date = new Date()) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay(),
  );

  const endOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + (6 - date.getDay()),
  );

  return {
    currentDate: date,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
  };
};

export const getMonthlySum = (arr, dateName) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const result = Array.from(
    { length: currentMonth + 1 },
    (_, month) =>
      arr.filter((item) => new Date(item[dateName]).getMonth() === month)
        .length,
  );
  return result;
};

export const generateAndSendPDF = async (elemId) => {
  try {
    const { default: html2pdf } = await import('html2pdf.js');
    const element = document.getElementById(elemId);

    if (!element) {
      return;
    }

    const pdf = await html2pdf()
      .from(element)
      .toPdf()
      .set({ dpi: 600 })
      .get('pdf');

    const pdfBlob = pdf.output('blob');
    const formData = new FormData();

    const file = new File([pdfBlob], 'file.pdf', { type: 'application/pdf' });
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      return { status: res.status, message: res.text() };
    }
    const data = await res.json();
    return { ...data, status: res.status };
  } catch (error) {
    return { status: error.status, message: error.message };
  }
};

export const formatTechParams = (arr, val) => {
  if (!val) return arr;
  const value = arr.map((item) => {
    if (
      item.param_name ===
      Object.keys(val).find((key) => val[key] === val[item.param_name])
    ) {
      return { ...item, value: val[item.param_name] };
    }
    return item;
  });
  return value;
};

export const resetDafaultParams = (arr) => {
  const result = {};
  arr.forEach((item) => {
    if (item.value) {
      result[item.param_name] = item.value;
    }
  });
  return result;
};

export const filterObject = (obj) => {
  const filteredKeys = Object.keys(obj).filter((key) => {
    const value = obj[key];
    return value !== null && value !== undefined && value !== '';
  });

  const filteredObject = {};
  filteredKeys.forEach((key) => {
    filteredObject[key] = obj[key];
  });

  return filteredObject;
};

export const formatNumberLocale = (num, locale = 'tr') => {
  if (!num) return num;
  const nFormat = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
  });
  return nFormat.format(num);
};

export async function validateCustomerSchema(data) {
  const requiredFields = [
    'rep_name',
    'country_code',
    'province_code',
    'district_code',
  ]; // Add other required fields
  //const schemaFields = []; // Define all expected fields

  const missingFields = requiredFields.filter(
    (field) => !data.hasOwnProperty(field),
  );
  const errors = [];
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return errors;
}

export async function postToLogo(Data) {
  const res = await fetch('/api/logoapi/postdata', {
    method: 'POST',
    body: Data,
  });
  if (!res.ok) {
    return { status: res.status, message: res.text() };
  }
  const data = await res.json();
  return { ...data, status: res.status };
}

export const formatCurrency = (value, type = 'float') => {
  if (!value) return '';
  if (type === 'int') {
    return formatNumberLocale(value);
  }

  return parseFloat(value)
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const deformatCurrency = (value, type): number => {
  if (!value) return 0;

  if (type === 'int') {
    const val = value?.replaceAll('.', '') || 0;
    return parseInt(val);
  }
  const val = value?.replaceAll('.', '')?.replace(',', '.');
  return parseFloat(val);
};
