// machines.ts

interface MachineData {
  machine_Name: string;
  machineParams: { param_name: string; display_name: string }[];
}

export const machines: MachineData[] = [
  {
    machine_Name: 'Mikrokapsül',
    machineParams: [
      { param_name: 'Makine_seçimi', display_name: 'Makine Seçimi' },
      { param_name: 'Viskozite', display_name: 'Viskozite' },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hızı', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hızı', display_name: 'Makine Hızı' },
      { param_name: 'Hava_Basıncı', display_name: 'Hava Basıncı' },
      { param_name: 'Fırın_Bant_Hızı', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Fırın_Sıcaklığı', display_name: 'Fırın Sıcaklığı' },
      { param_name: 'İndüksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'İndüksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'İndüksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Üretim/saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Patch',
    machineParams: [
      { param_name: 'Makine_seçimi', display_name: 'Makine Seçimi' },
      {
        param_name: 'Patch_Vibrasyon_hızı',
        display_name: 'Patch Vibrasyon Hızı',
      },
      { param_name: 'Patch_Hava_Basıncı', display_name: 'Patch Hava Basıncı' },
      {
        param_name: 'Patch_Toz_yükleme_Hızı',
        display_name: 'Patch Toz Yükleme Hızı',
      },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hızı', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hızı', display_name: 'Makine Hızı' },
      { param_name: 'Fırın_Bant_Hızı', display_name: 'Fırın Bant Hızı' },
      { param_name: 'İndüksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'İndüksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'İndüksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Üretim/saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'ST-3',
    machineParams: [
      { param_name: 'Makine_seçimi', display_name: 'Makine Seçimi' },
      { param_name: 'Viskozite', display_name: 'Viskozite' },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hızı', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hızı', display_name: 'Makine Hızı' },
      { param_name: 'Hava_Basıncı', display_name: 'Hava Basıncı' },
      { param_name: 'Fırın_Bant_Hızı', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Fırın_Sıcaklığı', display_name: 'Fırın Sıcaklığı' },
      { param_name: 'Ort_Üretim/saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Maskeleme',
    machineParams: [
      { param_name: 'Makine_seçimi', display_name: 'Makine Seçimi' },
      { param_name: 'Viskozite', display_name: 'Viskozite' },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hızı', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hızı', display_name: 'Makine Hızı' },
      { param_name: 'Hava_Basıncı', display_name: 'Hava Basıncı' },
      { param_name: 'Fırın_Bant_Hızı', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Fırın_Sıcaklığı', display_name: 'Fırın Sıcaklığı' },
      { param_name: 'İndüksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'İndüksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'İndüksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Üretim/saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'EZ-Drive',
    machineParams: [
      { param_name: 'Makine_seçimi', display_name: 'Makine Seçimi' },
      {
        param_name: 'Patch_Vibrasyon_hızı',
        display_name: 'Patch Vibrasyon Hızı',
      },
      { param_name: 'Patch_Hava_Basıncı', display_name: 'Patch Hava Basıncı' },
      {
        param_name: 'Patch_Toz_yükleme_Hızı',
        display_name: 'Patch Toz Yükleme Hızı',
      },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hızı', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hızı', display_name: 'Makine Hızı' },
      { param_name: 'Fırın_Bant_Hızı', display_name: 'Fırın Bant Hızı' },
      { param_name: 'İndüksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'İndüksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'İndüksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Üretim/saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Plastisol',
    machineParams: [
      { param_name: 'Makine_seçimi', display_name: 'Makine Seçimi' },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hızı', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hızı', display_name: 'Makine Hızı' },
      { param_name: 'Teach_Ayarı', display_name: 'Teach Ayarı' },
      { param_name: 'Delay_Ayarı', display_name: 'Delay Ayarı' },
      { param_name: 'Purge_Ayarı', display_name: 'Purge Ayarı' },
      { param_name: 'İndüksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'İndüksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'İndüksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Üretim/saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Strip',
    machineParams: [
      { param_name: 'Makine_seçimi', display_name: 'Makine Seçimi' },
      { param_name: 'Testere_seçimi', display_name: 'Testere Seçimi' },
      { param_name: 'Kesim_Mesafesi', display_name: 'Kesim Mesafesi' },
      { param_name: 'Yuva_Boyutu', display_name: 'Yuva Boyutu' },
      { param_name: 'Ort_Üretim/saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Kafa_Boyama',
    machineParams: [
      { param_name: 'Makine_seçimi', display_name: 'Makine Seçimi' },
      { param_name: 'Ort_Üretim/saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
  {
    machine_Name: 'Mühürleme',
    machineParams: [
      { param_name: 'Makine_seçimi', display_name: 'Makine Seçimi' },
      { param_name: 'Besleme_Tipi', display_name: 'Besleme Tipi' },
      { param_name: 'Besleme_Hızı', display_name: 'Besleme Hızı' },
      { param_name: 'Makine_Hızı', display_name: 'Makine Hızı' },
      { param_name: 'Hava_Basıncı', display_name: 'Hava Basıncı' },
      { param_name: 'Fırın_Bant_Hızı', display_name: 'Fırın Bant Hızı' },
      { param_name: 'Fırın_Sıcaklığı', display_name: 'Fırın Sıcaklığı' },
      { param_name: 'İndüksiyon_kW', display_name: 'İndüksiyon kW' },
      { param_name: 'İndüksiyon_Volts', display_name: 'İndüksiyon Volts' },
      { param_name: 'İndüksiyon_kHz', display_name: 'İndüksiyon kHz' },
      { param_name: 'Ort_Üretim/saat', display_name: 'Ort. Üretim/saat' },
    ],
  },
];
