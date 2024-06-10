// machines.ts

interface MachineData {
  machine_Name: string;
  machineParams: { param_name: string; display_name: string }[];
}

export const machines: MachineData[] = [
  {
    machine_Name: 'Mikrokapsül',
    machineParams: [
      { param_name: 'Viskozite', display_name: 'Viskozite' },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hizi', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hizi', display_name: 'Makine Hızı' },
      { param_name: 'Hava_Basinci', display_name: 'Hava Basıncı' },
      { param_name: 'Firin_Bant_Hizi', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Firin_Sicakligi', display_name: 'Fırın Sıcaklığı' },
      { param_name: 'Induksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'Induksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'Induksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Uretim_saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Patch',
    machineParams: [
      {
        param_name: 'Patch_Vibrasyon_hizi',
        display_name: 'Patch Vibrasyon Hızı',
      },
      { param_name: 'Patch_Hava_Basinci', display_name: 'Patch Hava Basıncı' },
      {
        param_name: 'Patch_Toz_yukleme_Hizi',
        display_name: 'Patch Toz Yükleme Hızı',
      },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hizi', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hizi', display_name: 'Makine Hızı' },
      { param_name: 'Firin_Bant_Hizi', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Induksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'Induksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'Induksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Uretim_saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'ST-3',
    machineParams: [
      { param_name: 'Viskozite', display_name: 'Viskozite' },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hizi', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hizi', display_name: 'Makine Hızı' },
      { param_name: 'Hava_Basinci', display_name: 'Hava Basıncı' },
      { param_name: 'Firin_Bant_Hizi', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Firin_Sicakligi', display_name: 'Fırın Sıcaklığı' },
      { param_name: 'Ort_Uretim_saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Maskeleme',
    machineParams: [
      { param_name: 'Viskozite', display_name: 'Viskozite' },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hizi', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hizi', display_name: 'Makine Hızı' },
      { param_name: 'Hava_Basinci', display_name: 'Hava Basıncı' },
      { param_name: 'Firin_Bant_Hizi', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Firin_Sicakligi', display_name: 'Fırın Sıcaklığı' },
      { param_name: 'Induksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'Induksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'Induksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Uretim_saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'EZ-Drive',
    machineParams: [
      {
        param_name: 'Patch_Vibrasyon_hizi',
        display_name: 'Patch Vibrasyon Hızı',
      },
      { param_name: 'Patch_Hava_Basinci', display_name: 'Patch Hava Basıncı' },
      {
        param_name: 'Patch_Toz_yukleme_Hizi',
        display_name: 'Patch Toz Yükleme Hızı',
      },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hizi', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hizi', display_name: 'Makine Hızı' },
      { param_name: 'Firin_Bant_Hizi', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Induksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'Induksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'Induksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Uretim_saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Plastisol',
    machineParams: [
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hizi', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hizi', display_name: 'Makine Hızı' },
      { param_name: 'Teach_Ayari', display_name: 'Teach Ayarı' },
      { param_name: 'Delay_Ayari', display_name: 'Delay Ayarı' },
      { param_name: 'Purge_Ayari', display_name: 'Purge Ayarı' },
      { param_name: 'Induksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'Induksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'Induksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Uretim_saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Strip',
    machineParams: [
      { param_name: 'Testere_secimi', display_name: 'Testere Seçimi' },
      { param_name: 'Kesim_Mesafesi', display_name: 'Kesim Mesafesi' },
      { param_name: 'Yuva_Boyutu', display_name: 'Yuva Boyutu' },
      { param_name: 'Ort_Uretim_saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Kafa_Boyama',
    machineParams: [
      { param_name: 'Ort_Uretim_saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Mühürleme',
    machineParams: [
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hizi', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hizi', display_name: 'Makine Hızı' },
      { param_name: 'Hava_Basinci', display_name: 'Hava Basıncı' },
      { param_name: 'Firin_Bant_Hizi', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Firin_Sicakligi', display_name: 'Fırın Sıcaklığı' },
      { param_name: 'Induksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'Induksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'Induksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Uretim_saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
];
