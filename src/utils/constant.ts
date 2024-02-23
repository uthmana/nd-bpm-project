export const entryPages = [
  '/auth/sign-in',
  '/auth/forgot-password',
  '/auth/change-password',
];

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const techParameters = [
  { id: '1', param_name: 'viskozite' },
  { id: '2', param_name: 'besleme_Tipi' },
  { id: '3', param_name: 'besleme_Hizi' },
  { id: '4', param_name: 'makine_Hizi' },
  { id: '5', param_name: 'hava_Basinci' },
  { id: '6', param_name: 'firin_Bant_Hizi' },
  { id: '7', param_name: 'firin_Bant_Hizi' },
  { id: '8', param_name: 'induksiyon_kW' },
  { id: '9', param_name: 'induksiyon_kHz' },
  { id: '10', param_name: 'patch_Vibrasyon_hizi' },
  { id: '11', param_name: 'patch_Hava_Basinci' },
  { id: '12', param_name: 'patch_Toz_yukleme_Hizi' },
  { id: '13', param_name: 'teach_Ayari' },
  { id: '14', param_name: 'delay_Ayari' },
  { id: '15', param_name: 'purge_Ayari' },
  { id: '16', param_name: 'testere_secimi' },
  { id: '17', param_name: 'kesim_Mesafesi' },
  { id: '18', param_name: 'yuva_Boyutu' },
  { id: '19', param_name: 'saat' },
];

export const applications = [
  'ND Patch',
  'ND Strip',
  'ST-3 Thread Sealant',
  'LM-1293 Maskeleme',
  'Vibra-Tite VC-3',
  'ND Microspheres 593 S',
  'ND Microspheres TA 850',
  'ND Microspheres TA 800',
  'ND Microspheres TA 300',
  'ND Microspheres 1193 S',
  'EZ-Drive 300 Lubricating',
  'EZ-Drive 200 Lubricating',
];
export const standards = [
  'DIN 267-27',
  'DIN 267-28',
  'Müşteri isteği',
  'WA 970',
  'WSS-M21P27-A4',
  'IFI-124',
  'IFI-125',
  'IFI-524',
  'IFI-525',
  'MS-CC76',
  'PF-6616',
  'WX 200',
  'Diğer',
];
export const colors = [
  'Mavi',
  'Turuncu',
  'Turkuaz',
  'Pembe',
  'Kırmızı',
  'Yeşil',
  'Sarı',
  'Beyaz',
  'Siyah',
];

export const platings = [
  'Beyaz Çinko',
  'Siyah Çinko',
  'Sarı Çinko',
  'Çinko',
  'Nikel',
  'Pırtınç',
  'Karartma',
  'Paslanmaz',
  'Çinko Nikel',
  'Siyah Fosfat',
  'Zn',
  'Kayganlaştırıcı',
  'Galvanizli',
  'Diğer',
];

export const confirmation = [
  { name: 'Uygun', value: true },
  { name: 'Uygunsuz', value: false },
];

export const dirtyConfirmation = [
  { name: 'Var', value: true },
  { name: 'Yok', value: false },
];

export const materials = ['Karışık', 'Düzenli'];

export const processConfirmation = ['Yazılsın', 'Yazılmasın'];

export const results = [
  { value: 'ACCEPT', name: 'Kabul' },
  { value: 'ACCEPTANCE_WITH_CONDITION', name: 'Şartlı Kabul' },
  { value: 'PRE_PROCESS', name: 'Ön İşlem gerekli' },
  { value: 'REJECT', name: 'Ret' },
];

export const faultInfo = [
  'product_barcode',
  'customerName',
  'product',
  'quantity',
  'application',
  'standard',
  'color',
  'productCode',
  'createdBy',
  'arrivalDate',
  'technicalDrawingAttachment',
  'faultDescription',
];

export const infoTranslate = {
  product_barcode: 'Barkodu',
  customerName: 'Müşteri',
  product: 'Ürün Tanımı',
  quantity: 'Miktar',
  application: 'Uygulama',
  standard: 'Standart',
  color: 'Renk',
  productCode: 'Ürün Kodu',
  createdBy: 'Personel',
  arrivalDate: 'Giriş Tarihi',
  technicalDrawingAttachment: 'İlgili Doküman',
  faultDescription: 'Açıklama',
};

export const faultControlInfo = [
  'plating',
  'productDimension',
  'dimensionConfirmation',
  'quantityConfirmation',
  'dirtyThreads',
  'processFrequency',
  'remarks',
  'result',
  'createdBy',
  'createdAt',
  'updatedBy',
  'updatedAt',
  'image',
];

export const faultControlTranslate = {
  plating: 'Kaplama',
  productDimension: 'Malzeme Türü',
  dimensionConfirmation: 'Ürün Boyutlari',
  quantityConfirmation: 'Miktar',
  dirtyThreads: 'Temizleme',
  processFrequency: 'Proses Frekansi',
  remarks: 'Açıklama',
  result: 'Sonuç',
  createdBy: 'Oluşturan',
  createdAt: 'Oluşturma Tarihi',
  updatedBy: 'Güncelleyen',
  updatedAt: 'Güncelleme Tarihi',
  image: 'İlgili Doküman',
};
