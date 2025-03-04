import { Invoice } from 'app/localTypes/types';
import { postlogoDispatch } from '../apiRequest';

export const generateUniqueId = () => {
  const prefix = 'TES';
  const timestamp = Date.now().toString();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${prefix}${timestamp.slice(-7)}${randomSuffix}`;
};

export const sendDispatchToLogo = async (invoice: Invoice) => {
  if (!invoice) {
    return;
  }

  const uniqueId = generateUniqueId();

  const products = invoice?.Fault.map((fault) => {
    return {
      TYPE: 0,
      QUANTITY: fault?.quantity,
      MASTER_CODE: fault?.productCode,
      DISP_STATUS: 1,
      CANCEL_EXP: 'test amaçlı kesilmiştir.',
      VATEXCEPT_REASON: 'bedelsiz',
      UNIT_CODE: 'ADET',
      TAX_FREE_CHECK: 0,
      TOTAL_NET_STR: 'Sıfır TL',
      IS_OKC_FICHE: 0,
      LABEL_LIST: {},
    };
  });

  const logodata = {
    INTERNAL_REFERENCE: null,
    GRPCODE: 2,
    TYPE: 8,
    IOCODE: 3,
    NUMBER: uniqueId, //At maximum it accepts 10 characters. the Invoice number needs to be unique. It will be changed to use their invoice scheme if all is ready to be used
    DATE: invoice.invoiceDate, //  '2024-10-02T00:00:00',
    //NUMBER: '~',
    DOC_NUMBER: `SİLMEYİN11Test${invoice.barcode}`,
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
