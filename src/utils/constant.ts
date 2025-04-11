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

export const finalResultsList = [
  { value: 'ACCEPT', name: 'Kabul' },
  {
    value: 'ACCEPTANCE_WITH_CONDITION',
    name: 'Şartlı Kabul',
  },
  { value: 'REJECT', name: 'Red' },
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
  'invoiceDate',
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
  invoiceDate: 'Bitiş Tarihi',
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

export const turkeyCities = {
  '01': 'ADANA',
  '02': 'ADIYAMAN',
  '03': 'AFYONKARAHİSAR',
  '04': 'AĞRI',
  '05': 'AMASYA',
  '06': 'ANKARA',
  '07': 'ANTALYA',
  '08': 'ARTVİN',
  '09': 'AYDIN',
  '10': 'BALIKESİR',
  '11': 'BİLECİK',
  '12': 'BİNGÖL',
  '13': 'BİTLİS',
  '14': 'BOLU',
  '15': 'BURDUR',
  '16': 'BURSA',
  '17': 'ÇANAKKALE',
  '18': 'ÇANKIRI',
  '19': 'ÇORUM',
  '20': 'DENİZLİ',
  '21': 'DİYARBAKIR',
  '22': 'EDİRNE',
  '23': 'ELAZIĞ',
  '24': 'ERZİNCAN',
  '25': 'ERZURUM',
  '26': 'ESKİŞEHİR',
  '27': 'GAZİANTEP',
  '28': 'GİRESUN',
  '29': 'GÜMÜŞHANE',
  '30': 'HAKKARİ',
  '31': 'HATAY',
  '32': 'ISPARTA',
  '33': 'MERSİN',
  '34': 'İSTANBUL',
  '35': 'İZMİR',
  '36': 'KARS',
  '37': 'KASTAMONU',
  '38': 'KAYSERİ',
  '39': 'KIRKLARELİ',
  '40': 'KIRŞEHİR',
  '41': 'KOCAELİ (İZMİT)',
  '42': 'KONYA',
  '43': 'KÜTAHYA',
  '44': 'MALATYA',
  '45': 'MANİSA',
  '46': 'KAHRAMANMARAŞ',
  '47': 'MARDİN',
  '48': 'MUĞLA',
  '49': 'MUŞ',
  '50': 'NEVŞEHİR',
  '51': 'NİĞDE',
  '52': 'ORDU',
  '53': 'RİZE',
  '54': 'SAKARYA (ADAPAZARI)',
  '55': 'SAMSUN',
  '56': 'SİİRT',
  '57': 'SİNOP',
  '58': 'SİVAS',
  '59': 'TEKİRDAĞ',
  '60': 'TOKAT',
  '61': 'TRABZON',
  '62': 'TUNCELİ',
  '63': 'ŞANLIURFA',
  '64': 'UŞAK',
  '65': 'VAN',
  '66': 'YOZGAT',
  '67': 'ZONGULDAK',
  '68': 'AKSARAY',
  '69': 'BAYBURT',
  '70': 'KARAMAN',
  '71': 'KIRIKKALE',
  '72': 'BATMAN',
  '73': 'ŞIRNAK',
  '74': 'BARTIN',
  '75': 'ARDAHAN',
  '76': 'IĞDIR',
  '77': 'YALOVA',
  '78': 'KARABÜK',
  '79': 'KİLİS',
  '80': 'OSMANİYE',
  '81': 'DÜZCE',
};
