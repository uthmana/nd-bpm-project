export type Transaction = {
  Type: number; // 0 for Material
  MASTER_CODE: string; // Material Code
  PRICE: number; // Material Price
  QUANTITY: number; // Number of materials
  UNITCODE: string; // Unit code used
  STOCKREF?: number; // Stock Reference
};

export type LogoDispatchDto = {
  INTERNAL_REFERENCE?: number | null;
  TYPE: number; // 8 for salesdispatch
  ARP_CODE: string; // Client Code
  NOTES1?: string; // Description
  //PAYMENT_CODE?: number; // Payment Plan (1 month)
  DOC_DATE: string; // Document Date
  NUMBER?: string | null; // Unique Number
  DATE: string; // Invoice Date
  DOC_NUMBER?: string; // Document Number
  TRANSACTIONS?: Transaction[]; // Array of transactions
};

export function convertToLogoDate(dto: Logodata): LogoDispatchDto {
  return {
    ...dto,
    DATE: new Date(dto.DATE).toLocaleDateString(), // Format the DATE
    DOC_DATE: dto.DOC_DATE ? new Date(dto.DOC_DATE).toLocaleDateString() : null,
  };
}
