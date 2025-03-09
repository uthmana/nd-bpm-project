import { Invoice } from 'app/localTypes/types';
import { fetchAPI } from '../apiRequest/request';

export async function postlogoDispatch(payload) {
  return fetchAPI('logoapi/postdata', 'post', payload);
}

export async function customerSync() {
  return fetchAPI('logoapi/customersync', 'post');
}

export async function stockSync() {
  return fetchAPI('logoapi/stocksync', 'post');
}

function generateUniqueId() {
  const prefix = 'TES';
  const timestamp = Date.now().toString(); // Current time in milliseconds
  const randomSuffix = Math.floor(100 + Math.random() * 900); // Random 3-digit number
  return `${prefix}${timestamp.slice(-7)}${randomSuffix}`;
}

export const sendDispatchToLogo = async (invoice: Invoice) => {
  if (!invoice) {
    return;
  }

  const invnUmber = generateUniqueId();

  const products = invoice?.Fault.map((fault) => {
    return {
      TYPE: 0,
      QUANTITY: fault?.quantity,
      MASTER_CODE: fault?.productCode,
      DISP_STATUS: 1,
      CANCEL_EXP: 'test amaçlı kesilmiştir.',
      UNIT_CODE: 'ADET',
    };
  });

  const logodata = {
    INTERNAL_REFERENCE: null,
    GRPCODE: 2,
    TYPE: 8,
    IOCODE: 3,
    NUMBER: invnUmber,
    DATE: `${invoice.invoiceDate}`,
    //NUMBER: '~',
    DOC_NUMBER: `SİLMEYİN${invoice.barcode}`,
    ARP_CODE: invoice.customer.code, //'S.00055', //customerinfo.response.data.code
    CANCELLED: 1,
    PRINT_COUNTER: 0,
    CURRSEL_TOTALS: 1,
    TRANSACTIONS: {
      items: products,
    },
    EDESPATCH: 1,
    EDESPATCH_PROFILEID: 1,
    EINVOICE: 1,
    EINVOICE_PROFILEID: 1,
    EINVOICE_DRIVERNAME1: '.',
    EINVOICE_DRIVERSURNAME1: '.',
    EINVOICE_DRIVERTCKNO1: '.',
    EINVOICE_PLATENUM1: '.',
    EINVOICE_CHASSISNUM1: '.',
  };

  try {
    const respponse = await postlogoDispatch(JSON.stringify(logodata));
    return respponse;
  } catch (err) {
    return err;
  }
};
