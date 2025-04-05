export type Customer = {
  id: string;
  code?: string | null;
  cardType?: CardType;
  taxNo?: string | null;
  company_name?: string | null;
  address?: string | null;
  postalCode?: string | null;
  phoneNumber?: string | null;
  phoneNumber_shipment?: string | null;
  phoneNumber_quality?: string | null;
  phoneNumber_accountant?: string | null;
  email?: string | null;
  email_quality?: string | null;
  email_offer?: string | null;
  email_accountant?: string | null;
  tax_Office?: string | null;
  taxOfficeCode?: string | null;
  rep_name: string;
  currency?: Currency;
  country_code: string;
  province_code: string;
  district_code: string;
  definition?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  Offers: Offer[];
  Fault: Fault[];
  Stock: Stock[];
  Invoice: Invoice[];
};

export type Invoice = {
  id: string;
  barcode?: string | null;
  invoiceDate: Date;
  currency?: Currency;
  docPath?: String;
  amount?: number | null;
  vat?: number | null;
  serverSide?: Boolean | null;
  totalAmount?: number | null;
  description?: string | null;
  Fault: Fault[];
  status: InvoiceStatus;
  customer: Customer;
  customerId: string;
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
};

export type Fault = {
  id: string;
  customerId?: string | null;
  customer?: Customer | null;
  arrivalDate?: Date | null;
  invoiceDate?: Date | null;
  product?: string | null;
  product_barcode?: string | null;
  quantity?: number | null;
  shipmentQty?: number | null;
  productCode?: string | null;
  productBatchNumber?: string | null;
  application?: string | null;
  standard?: string | null;
  color?: string | null;
  faultDescription?: string | null;
  technicalDrawingAttachment?: string | null;
  status: FaultStatus;
  faultControl: FaultControl[];
  unacceptable: Unacceptable[];
  process: Process[];
  finalControl: FinalControl[];
  defaultTechParameter: TechnicalParameter[];
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  Invoice?: Invoice | null;
  invoiceId?: string | null;
};

export type Offer = {
  id: string;
  OfferType?: string;
  barcode?: string | null;
  startDate: Date;
  endDate: Date;
  currency?: Currency;
  amount?: number | null;
  vat?: number | null;
  totalAmount?: number | null;
  address?: string | null;
  description?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  creatorTitle?: string | null;
  rep_name?: string | null;
  tax_Office?: string | null;
  taxNo?: string | null;
  docPath?: string | null;
  product: OfferItem[];
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  status?: OfferStatus;
  customerId?: string | null;
  Customer?: Customer | null;
};

export type OfferItem = {
  id: string;
  name?: string | null;
  application?: string | null;
  standard?: string | null;
  currency?: Currency;
  quantity?: number | null;
  price?: number | null;
  unitPrice?: number | null;
  discountPrice?: number | null;
  description?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  offerId?: string | null;
  Offer?: Offer | null;
};

export type Stock = {
  id: string;
  product_code: string;
  product_name: string;
  product_barcode?: string | null;
  productBatchNumber?: string | null;
  description?: string | null;
  main_group?: string | null;
  group1?: string | null;
  group2?: string | null;
  inventory?: number | null;
  unit?: string | null;
  current_price?: string | null;
  currency?: Currency;
  brand?: string | null;
  date?: Date | null;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  image?: string | null;
  customerId?: string | null;
  customer?: Customer | null;
  defaultTechParameter: TechnicalParameter[];
  faultId?: string | null;
};

export type FaultControl = {
  id: string;
  traceabilityCode?: string | null;
  arrivalDate?: Date | null;
  invoiceDate?: Date | null;
  product?: string | null;
  quantity?: number | null;
  productCode?: string | null;
  productBatchNumber?: string | null;
  plating?: string | null;
  controlDate?: Date | null;
  image?: string | null;
  productDimension?: string | null;
  dimensionConfirmation?: boolean | null;
  quantityConfirmation?: boolean | null;
  dirtyThreads?: boolean;
  deformity?: boolean;
  processFrequency?: string | null;
  frequencyDimension?: number | null;
  remarks?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  result: FaultControlResult;
  faultId: string;
  Fault: Fault;
};

export type FinalControl = {
  id: string;
  olcu_Kontrol?: FinalItemStatus | null;
  gorunum_kontrol?: FinalItemStatus | null;
  tork_Kontrol?: FinalItemStatus | null;
  paketleme?: string | null;
  kontrol_edilen_miktar?: number | null;
  hatali_miktar?: number | null;
  nakliye_miktar?: number | null;
  image?: string | null;
  remarks?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  result: FaultControlResult;
  testItem: TestItem[];
  testArea: TestArea[];
  faultId: string;
  Fault: Fault;
};

export type Process = {
  id: string;
  frequency?: number | null;
  technicalDrawingAttachment?: string | null;
  machineName?: string | null;
  machineId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  faultId?: string | null;
  Fault?: Fault | null;
  status: ProcessStatus;
  technicalParams: TechnicalParameter[];
  machine: Machine[];
};

export type Machine = {
  id: string;
  machine_Name: string;
  machineParams: MachineParams[];
  processId?: string | null;
  Process?: Process | null;
};

export type MachineParams = {
  id: string;
  param_name?: string | null;
  display_name?: string | null;
  machineId?: string | null;
  Machine?: Machine | null;
};

export type Unacceptable = {
  id: string;
  unacceptableDescription?: string | null;
  unacceptableAction?: string | null;
  result?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  faultId?: string | null;
  Fault?: Fault | null;
  unacceptableStage: UnacceptableStageStatus;
};

export type TechnicalParameter = {
  id: string;
  Ort_Uretim_saat?: string | null;
  Viskozite?: string | null;
  Besleme_Tipi?: string | null;
  Besleme_Hizi?: string | null;
  Makine_Hizi?: string | null;
  Hava_Basinci?: string | null;
  Firin_Bant_Hizi?: string | null;
  Firin_Sicakligi?: string | null;
  Induksiyon_kW?: string | null;
  Induksiyon_Volts?: string | null;
  Induksiyon_kHz?: string | null;
  Patch_Vibrasyon_hizi?: string | null;
  Patch_Hava_Basinci?: string | null;
  Patch_Toz_yukleme_Hizi?: string | null;
  Teach_Ayari?: string | null;
  Delay_Ayari?: string | null;
  Purge_Ayari?: string | null;
  Testere_secimi?: string | null;
  Kesim_Mesafesi?: string | null;
  Yuva_Boyutu?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  machineId: string;
  processId?: string | null;
  faultId?: string | null;
  stockId?: string | null;
  Process?: Process | null;
  Fault?: Fault | null;
  Stock?: Stock | null;
};

export type TestArea = {
  id: string;
  title?: string | null;
  requiredValue?: string | null;
  unit?: string | null;
  required_1?: string | null;
  required_2?: string | null;
  required_3?: string | null;
  required_4?: string | null;
  result_1?: string | null;
  result_2?: string | null;
  result_3?: string | null;
  result_4?: string | null;
  result_5?: string | null;
  result_6?: string | null;
  finalControlId?: string | null;
  FinalControl?: FinalControl | null;
};

export type TestItem = {
  id: string;
  standard?: string | null;
  requiredValue?: string | null;
  x1?: string | null;
  x2?: string | null;
  x3?: string | null;
  x4?: string | null;
  x5?: string | null;
  x6?: string | null;
  x7?: string | null;
  x8?: string | null;
  x9?: string | null;
  x10?: string | null;
  result?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  finalControlId?: string | null;
  FinalControl?: FinalControl | null;
};

export enum InvoiceStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
}

export enum OfferStatus {
  SENT = 'SENT',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum Currency {
  TL = 'TL',
  USD = 'USD',
  EUR = 'EUR',
}

export enum CardType {
  ALICI_SATICI = 'ALICI_SATICI',
  ALICI = 'ALICI',
  SATICI = 'SATICI',
}

export enum ProcessStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  FINISHED = 'FINISHED',
}

export enum FaultControlResult {
  ACCEPT = 'ACCEPT',
  ACCEPTANCE_WITH_CONDITION = 'ACCEPTANCE_WITH_CONDITION',
  PRE_PROCESS = 'PRE_PROCESS',
  REJECT = 'REJECT',
}

export enum FaultStatus {
  GIRIS_KONTROL_BEKLENIYOR = 'GIRIS_KONTROL_BEKLENIYOR',
  PROSES_BEKLENIYOR = 'PROSES_BEKLENIYOR',
  PROSES_ISLENIYOR = 'PROSES_ISLENIYOR',
  FINAL_KONTROL_BEKLENIYOR = 'FINAL_KONTROL_BEKLENIYOR',
  IRSALIYE_KESIMI_BEKLENIYOR = 'IRSALIYE_KESIMI_BEKLENIYOR',
  SEVKIYAT_TAMAMLANDI = 'SEVKIYAT_TAMAMLANDI',
  GIRIS_KONTROL_RET = 'GIRIS_KONTROL_RET',
  FINAL_KONTROL_RET = 'FINAL_KONTROL_RET',
  PENDING = 'PENDING',
  ACCEPT = 'ACCEPT',
  ACCEPTANCE_WITH_CONDITION = 'ACCEPTANCE_WITH_CONDITION',
  PRE_PROCESS = 'PRE_PROCESS',
  REJECT = 'REJECT',
}

export enum UnacceptableStageStatus {
  ENTRY = 'ENTRY',
  FINAL = 'FINAL',
  PROCESS = 'PROCESS',
  CUSTOMER = 'CUSTOMER',
}

export enum FinalItemStatus {
  OK = 'OK',
  NOT_OK = 'NOT_OK',
}
