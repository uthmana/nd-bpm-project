import { Invoice } from 'app/localTypes/types';
import { fetchAPI } from '../apiRequest/request';
import { generateUniqueId } from 'utils';

export async function customerSync() {
  return fetchAPI('logoapi/customersync', 'post');
}

export async function stockSync() {
  return fetchAPI('logoapi/stocksync', 'post');
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
  return fetchAPI('logoapi/postdata', 'post', JSON.stringify(logodata));
};
