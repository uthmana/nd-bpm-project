export const entryPages = [
  '/auth/sign-in',
  '/auth/forgot-password',
  '/auth/change-password',
];

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const techParameters = [
  {
    param_name: 'Ort_Uretim_saat',
    display_name: 'Ort. Üretim/saat',
  },
  {
    param_name: 'Viskozite',
    display_name: 'Viskozite',
    value: '',
  },
  {
    param_name: 'Besleme_Tipi',
    display_name: 'Besleme Tipi',
    value: '',
  },
  {
    param_name: 'Besleme_Hizi',
    display_name: 'Besleme Hızı',
    value: '',
  },
  {
    param_name: 'Makine_Hizi',
    display_name: 'Makine Hızı',
    value: '',
  },
  {
    param_name: 'Hava_Basinci',
    display_name: 'Hava Basıncı',
    value: '',
  },
  {
    param_name: 'Firin_Bant_Hizi',
    display_name: 'Fırın Bant Hızı',
    value: '',
  },
  {
    param_name: 'Firin_Sicakligi',
    display_name: 'Fırın Sıcaklığı',
    value: '',
  },
  {
    param_name: 'Induksiyon_kW',
    display_name: 'İndüksiyon kW',
    value: '',
  },
  {
    param_name: 'Induksiyon_Volts',
    display_name: 'İndüksiyon Volts',
    value: '',
  },
  {
    param_name: 'Induksiyon_kHz',
    display_name: 'İndüksiyon kHz',
    value: '',
  },
  {
    param_name: 'Patch_Vibrasyon_hizi',
    display_name: 'Patch Vibrasyon Hızı',
    value: '',
  },
  {
    param_name: 'Patch_Hava_Basinci',
    display_name: 'Patch Hava Basıncı',
    value: '',
  },
  {
    param_name: 'Patch_Toz_yukleme_Hizi',
    display_name: 'Patch Toz Yükleme Hızı',
    value: '',
  },
  {
    param_name: 'Teach_Ayari',
    display_name: 'Teach Ayarı',
    value: '',
  },
  {
    param_name: 'Delay_Ayari',
    display_name: 'Delay Ayarı',
    value: '',
  },
  {
    param_name: 'Purge_Ayari',
    display_name: 'Purge Ayarı',
    value: '',
  },
  {
    param_name: 'Testere_secimi',
    display_name: 'Testere Seçimi',
    value: '',
  },
  {
    param_name: 'Kesim_Mesafesi',
    display_name: 'Kesim Mesafesi',
    value: '',
  },
  {
    param_name: 'Yuva_Boyutu',
    display_name: 'Yuva Boyutu',
    value: '',
  },
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

export const materials = [
  'Cıvata',
  'Perçin',
  'Pim',
  'Pul',
  'Saplama',
  'Setskur',
  'Somun',
  'Vana,Tapa',
  'Vida',
  'Özel Parça',
];

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
  'status',
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
  status: 'DURUM',
};

export const faultControlInfo = [
  'plating',
  'productDimension',
  'dimensionConfirmation',
  'quantityConfirmation',
  'dirtyThreads',
  'deformity',
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
  deformity: 'Ezik/ Kırık Diş',
  processFrequency: 'Proses Frekansi',
  remarks: 'Açıklama',
  result: 'Sonuç',
  createdBy: 'Oluşturan',
  createdAt: 'Oluşturma Tarihi',
  updatedBy: 'Güncelleyen',
  updatedAt: 'Güncelleme Tarihi',
  image: 'İlgili Doküman',
};

export const currencySymbol = {
  TL: '₺',
  USD: '$',
  EUR: '€',
};
