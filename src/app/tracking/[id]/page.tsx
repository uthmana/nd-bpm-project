'use client';

import { getTrackingInfo } from 'app/lib/apiRequest';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  MdGroupWork,
  MdOutlineBusiness,
  MdOutlineCheck,
  MdTaskAlt,
} from 'react-icons/md';

const Page = () => {
  const [trackingInfo, setTrackingInfo] = useState([]);
  const queryParams = useParams();

  useEffect(() => {
    const getTrackingData = async (id) => {
      const { status, data } = await getTrackingInfo(id);
      if (status === 200) {
        setTrackingInfo(data);
      }
    };
    if (queryParams?.id) {
      getTrackingData(queryParams?.id);
    }
  }, [queryParams?.id]);

  return (
    <div className="w-full py-5">
      <h1 className="mb-5 text-center text-4xl capitalize">
        Prosesi ne durumda ?
      </h1>

      <div className="flex w-full justify-center">
        <div className="flex flex-nowrap gap-5">
          <div className="flex  flex-col items-center justify-center gap-3">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-4 border-green-500 md:h-[60px] md:w-[60px]">
              <MdOutlineBusiness className="h-5 w-5 text-green-500 md:h-8 md:w-8" />
            </div>
            <div className="rounded-lg border-2 border-green-500 px-2  py-1 text-center text-xs font-bold md:text-base">
              Giriş Yapıldı
            </div>
          </div>

          <div className=" flex flex-col items-center justify-center gap-3">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-4 border-green-500 md:h-[60px] md:w-[60px]">
              <MdOutlineCheck className="h-5 w-5 text-green-500 md:h-8 md:w-8" />
            </div>
            <div className="rounded-lg border-2 border-green-500 px-2  py-1 text-center  text-xs font-bold md:text-base">
              Giriş Kontrol Yapıldı
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-4 border-green-500 md:h-[60px] md:w-[60px]">
              <MdGroupWork className="h-5 w-5 text-green-500 md:h-8 md:w-8" />
            </div>
            <div className="rounded-lg border-2 border-green-500 px-2 py-1 text-center  text-xs font-bold md:text-base">
              Proses Yapıldı
            </div>
          </div>

          <div className=" flex flex-col items-center justify-center gap-3">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-4 border-green-500 md:h-[60px] md:w-[60px]">
              <MdOutlineCheck className="h-5 w-5 text-green-500 md:h-8 md:w-8" />
            </div>
            <div className="rounded-lg border-2 border-green-500 px-2 py-1 text-center  text-xs font-bold md:text-base">
              Final Kontrol Yapıldı
            </div>
          </div>

          <div className=" flex flex-col items-center justify-center gap-3">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-4 border-green-500 md:h-[60px] md:w-[60px]">
              <MdTaskAlt className="h-5 w-5 text-green-500 md:h-8 md:w-8" />
            </div>
            <div className="rounded-lg border-2 border-green-500 px-2 py-1 text-center text-xs  font-bold md:text-base">
              İrsaliye gönderildi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
