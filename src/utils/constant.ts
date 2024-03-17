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
    param_name: 'Makine_secimi',
    display_name: 'Makine Seçimi',
  },
  {
    param_name: 'Viskozite',
    display_name: 'Viskozite',
  },
  {
    param_name: 'Besleme_Tipi',
    display_name: 'Besleme Tipi',
  },
  {
    param_name: 'Besleme_Hizi',
    display_name: 'Besleme Hızı',
  },
  {
    param_name: 'Makine_Hizi',
    display_name: 'Makine Hızı',
  },
  {
    param_name: 'Hava_Basinci',
    display_name: 'Hava Basıncı',
  },
  {
    param_name: 'Firin_Bant_Hizi',
    display_name: 'Fırın Bant Hızı',
  },
  {
    param_name: 'Firin_Sicakligi',
    display_name: 'Fırın Sıcaklığı',
  },
  {
    param_name: 'Induksiyon_kW',
    display_name: 'İndüksiyon kW',
  },
  {
    param_name: 'Induksiyon_Volts',
    display_name: 'İndüksiyon Volts',
  },
  {
    param_name: 'Induksiyon_kHz',
    display_name: 'İndüksiyon kHz',
  },

  {
    param_name: 'Patch_Vibrasyon_hizi',
    display_name: 'Patch Vibrasyon Hızı',
  },
  {
    param_name: 'Patch_Hava_Basinci',
    display_name: 'Patch Hava Basıncı',
  },
  {
    param_name: 'Patch_Toz_yukleme_Hizi',
    display_name: 'Patch Toz Yükleme Hızı',
  },
  {
    param_name: 'Teach_Ayari',
    display_name: 'Teach Ayarı',
  },
  {
    param_name: 'Delay_Ayari',
    display_name: 'Delay Ayarı',
  },
  {
    param_name: 'Purge_Ayari',
    display_name: 'Purge Ayarı',
  },
  {
    param_name: 'Testere_secimi',
    display_name: 'Testere Seçimi',
  },
  {
    param_name: 'Kesim_Mesafesi',
    display_name: 'Kesim Mesafesi',
  },
  {
    param_name: 'Yuva_Boyutu',
    display_name: 'Yuva Boyutu',
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

export const currencySymbol = {
  TL: '₺',
  USD: '$',
  EUR: '€',
};
