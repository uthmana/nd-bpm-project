import React from 'react';
import nd_logo from '/public/img/auth/nd_logo.webp';

export default function page() {
  return (
    <div className="mx-auto w-[700px] max-w-[700px] bg-white px-10 py-12">
      <div className="mb-8 flex justify-between border-b-2">
        <div className="mb-2 max-w-[200px]">
          <div className="mb-3">
            <img width={90} src={nd_logo.src} alt="nd industries logo" />
          </div>
          <p className="text-sm">
            İkitelli OSB Metal-İş San. Sit. 4. Blok No:1 – No: 3 Başakşehir /
            İstanbul
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="mb-1 text-4xl">İrsaliye</h1>
          <p className="font-bold">Banka Hesap No:</p>
          <p className="text-sm">Şube Adı:</p>
          <div className="text-xs font-bold">
            <span>34334</span> <span> TR-87384859696745</span>
          </div>
        </div>
      </div>

      <div className="mb-12 flex justify-between gap-2">
        <div className="max-w-[200px]">
          <h2 className="mb-3 text-4xl">Sayın:</h2>
          <p className="mb-3 text-sm">Doğan Yıldız</p>
          <p className="mb-4 text-sm capitalize">
            DÖRTYOL SANAYİ ÇARŞI 9.YOL NO:1
          </p>

          <div className="flex justify-between text-sm">
            <div>
              <h2 className="font-bold">Vergi Dairesi</h2>
              <p>Beyoğlu</p>
            </div>
            <div>
              <h2 className="font-bold">Vergi No</h2>
              <p>321455</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5 bg-[#f5f4f4] px-10 py-5 text-sm">
          <div className="flex justify-between gap-3">
            <h2 className="font-bold">Düzenlenme Tarihi</h2>
            <p>01/12/2023</p>
          </div>

          <div className="flex justify-between gap-3">
            <h2 className="font-bold">Fiili Sevk Tarihi</h2>
            <p>01/12/2023</p>
          </div>
        </div>
      </div>

      <div className="mb-12 w-full">
        <div className="grid w-full grid-cols-5 gap-1 border-b font-bold">
          <div>No</div>
          <div>Ürün</div>
          <div>Miktar</div>
          <div>Birim Fiyat TL</div>
          <div>Tutar TL</div>
        </div>

        <div className="grid w-full grid-cols-5 gap-1 border-b py-2">
          <div>1</div>
          <div>Copper</div>
          <div>2</div>
          <div>50</div>
          <div>100</div>
        </div>
        <div className="grid w-full grid-cols-5 gap-1 border-b py-2">
          <div>2</div>
          <div>Nikel</div>
          <div>1</div>
          <div>50</div>
          <div>100</div>
        </div>
        <div className="grid w-full grid-cols-5 gap-1 border-b py-2">
          <div>3</div>
          <div>Brace</div>
          <div>2</div>
          <div>150</div>
          <div>300</div>
        </div>
        <div className="grid w-full grid-cols-5 gap-1 border-b py-2">
          <div>4</div>
          <div>Gold</div>
          <div>3</div>
          <div>1000</div>
          <div>3000</div>
        </div>
      </div>

      <div className="text-md ml-auto flex max-w-[300px] flex-col gap-5">
        <div className="flex justify-between bg-[#f5f4f4] px-3 py-3">
          <h2 className="font-bold">Toplam</h2>
          <p>1000TL</p>
        </div>
        <div className="flex justify-between px-3 py-3">
          <h2 className="font-bold">KDV%</h2>
          <p>18</p>
        </div>
        <div className="flex justify-between bg-[#f5f4f4] px-3 py-3">
          <h2 className="font-bold">Genel Toplam</h2>
          <p>1180TL</p>
        </div>
      </div>
    </div>
  );
}
