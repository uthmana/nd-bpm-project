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

  const [isEntry, setIsEntry] = useState(false);
  const [isEntryControl, setIsEntryControl] = useState(false);
  const [isProcess, setIsProcess] = useState(false);
  const [isFinalControl, setIsFinalControl] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);

  const queryParams = useParams();

  useEffect(() => {
    const getTrackingData = async (id) => {
      const { status, data } = await getTrackingInfo(id);
      if (status === 200) {
        const { entry, process, invoice } = data;
        setIsEntry(entry && entry?.id && true);
        setIsProcess(process && process?.id && true);
        setIsEntryControl(
          entry &&
            entry?.id &&
            entry?.faultControl &&
            entry?.faultControl[0]?.result === 'ACCEPT' &&
            true,
        );
        setIsFinalControl(
          process &&
            process?.id &&
            process?.finalControl &&
            process?.finalControl[0]?.result === 'ACCEPT' &&
            true,
        );

        setIsInvoice(
          invoice &&
            invoice?.id &&
            invoice?.process &&
            invoice?.process.length > 0 &&
            true,
        );
        setTrackingInfo(data);
      }
    };
    if (queryParams?.id) {
      getTrackingData(queryParams?.id);
    }
  }, [queryParams?.id]);

  return (
    <div className="w-full py-5">
      <h1 className="mb-12 text-center text-4xl capitalize">
        Prosesi ne durumda ?
      </h1>

      <div className="flex w-full justify-center">
        <div className="flex flex-nowrap gap-5">
          <div className="flex  flex-col items-center justify-center gap-3">
            <div
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-full border-4  md:h-[60px] md:w-[60px] ${
                isEntry ? 'border-green-500' : 'border-gray-500'
              }`}
            >
              <MdOutlineBusiness
                className={`h-5 w-5 md:h-8 md:w-8 ${
                  isEntry ? 'text-green-500' : 'text-gray-500'
                }`}
              />
            </div>
            <div
              className={`rounded-lg border-2 ${
                isEntry ? 'border-green-500' : 'border-red-500'
              } px-2 py-1 text-center  text-xs font-bold md:text-base`}
            >
              Giriş {isEntry ? 'Yapıldı' : 'Yapılmadı'}
            </div>
          </div>

          <div className=" flex flex-col items-center justify-center gap-3">
            <div
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-full border-4  md:h-[60px] md:w-[60px] ${
                isEntryControl ? 'border-green-500' : 'border-gray-500'
              }`}
            >
              <MdOutlineCheck
                className={`h-5 w-5  md:h-8 md:w-8 ${
                  isEntryControl ? 'text-green-500' : 'text-gray-500'
                }`}
              />
            </div>
            <div
              className={`rounded-lg border-2 ${
                isEntryControl ? 'border-green-500' : 'border-red-500'
              } px-2 py-1 text-center  text-xs font-bold md:text-base`}
            >
              Giriş Kontrol {isEntryControl ? 'Yapıldı' : 'Yapılmadı'}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-full border-4  md:h-[60px] md:w-[60px] ${
                isProcess ? 'border-green-500' : 'border-gray-500'
              }`}
            >
              <MdGroupWork
                className={`h-5 w-5 ${
                  isProcess ? 'text-green-500' : 'text-gray-500'
                }  md:h-8 md:w-8`}
              />
            </div>
            <div
              className={`rounded-lg border-2 ${
                isProcess ? 'border-green-500' : 'border-red-500'
              } px-2 py-1 text-center  text-xs font-bold md:text-base`}
            >
              Proses {isProcess ? 'Yapıldı' : 'Yapılmadı'}
            </div>
          </div>

          <div className=" flex flex-col items-center justify-center gap-3">
            <div
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-full border-4  md:h-[60px] md:w-[60px] ${
                isFinalControl ? 'border-green-500' : 'border-gray-500'
              }`}
            >
              <MdOutlineCheck
                className={`h-5 w-5 md:h-8 md:w-8 ${
                  isFinalControl ? 'text-green-500' : 'text-gray-500'
                }`}
              />
            </div>
            <div
              className={`rounded-lg border-2 ${
                isFinalControl ? 'border-green-500' : 'border-red-500'
              } px-2 py-1 text-center  text-xs font-bold md:text-base`}
            >
              Final Kontrol {isFinalControl ? 'Yapıldı' : 'Yapılmadı'}
            </div>
          </div>

          <div className=" flex flex-col items-center justify-center gap-3">
            <div
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-full border-4  md:h-[60px] md:w-[60px] ${
                isInvoice ? 'border-green-500' : 'border-gray-500'
              }`}
            >
              <MdTaskAlt
                className={`h-5 w-5  md:h-8 md:w-8 ${
                  isInvoice ? 'text-green-500' : 'text-gray-500'
                }`}
              />
            </div>
            <div
              className={`rounded-lg border-2 ${
                isInvoice ? 'border-green-500' : 'border-red-500'
              }  px-2 py-1 text-center text-xs  font-bold md:text-base`}
            >
              İrsaliye {isInvoice ? 'gönderildi' : 'gönderilmedi'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
