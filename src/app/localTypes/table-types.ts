export type FaultObj = {
  id?: string;
  customerName: string;
  traceabilityCode: string;
  arrivalDate: string;
  invoiceDate: string;
  product: string;
  quantity: number;
  productCode: string;
  productBatchNumber: string;
  application: string;
  standard: string;
  color: string;
  faultDescription: string;
  status: string;
  technicalDrawingAttachment: string;
  controlInfo: string;
  faultControl?: any;
  product_name?: string;
};

export type InvoiceObj = {
  id: string;
  barcode: string;
  invoiceDate: string;
  currency: string;
  amount: number;
  vat: number;
  totalAmount: number;
  tolalQty: number;
  description: string;
  status: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  address: string;
  totalQuantity: string;
  products: string;
  customerName: string;
};

export type InvoiceTable = {
  tableData: InvoiceObj[];
  variant: string;
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
  onAdd: (e: any) => void;
  onControl: (e: any) => void;
  searchValue: string;
};

export type MainTable = {
  tableData: FaultObj[];
  variant: string;
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
  onAdd: (e: any) => void;
  onControl: (e: any) => void;
  searchValue: string;
};

export type ProcessObj = {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  productCode: string;
  application: string;
  machineName: string;
  standard: string;
  color: string;
  technicalDrawingAttachment: string;
  status: string;
  faultId: string;
};

export type ProcessTable = {
  tableData: ProcessObj[];
  variant: string;
  onEdit?: (e: any) => void;
  onDelete?: (e: any) => void;
  onAdd?: (e: any) => void;
  onControl?: (e: any) => void;
  searchValue?: string;
};

export type UserObj = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  edit: string;
  delete: string;
};

export type CustomerObj = {
  id: string;
  rep_name: string;
  email: string;
  email_quality: string;
  email_offer: string;
  email_accountant: string;
  address: string;
  postalCode: string;
  company_name: string;
  phoneNumber: string;
  phoneNumber_shipment: string;
  phoneNumber_quality: string;
  phoneNumber_accountant: string;
  code: string;
  definition: string;
  taxNo: string;
  tax_Office: string;
  taxOfficeCode: string;
  cardType: string;
  country_code: string;
  province_code: string;
  district_code: string;
  currency: string;
};

export type StockObj = {
  product_code: string;
  product_name: string;
  product_barcode: string;
  inventory: number;
  current_price: string;
  description: string;
  main_group: string;
  group1: string;
  group2: string;
  brand: string;
  unit: string;
  curency: string;
  date: string;
  image: string;
  customerName: string;
};

export type PrimaryTable = {
  tableData: UserObj | CustomerObj | StockObj | any;
  variant: string;
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
  onAdd: (e: any) => void;
  onSearch?: (e: any) => void;
};
