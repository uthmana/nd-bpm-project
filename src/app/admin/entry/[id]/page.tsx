'use client';
import React, { useEffect, useState } from 'react';
import FaultForm from 'components/forms/fault';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { toast } from 'react-toastify';
import { getFaultById, updateFault } from 'app/lib/apiRequest';
import { UserFormSkeleton } from 'components/skeleton';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import {
  formatDateTime,
  faultInfo,
  infoTranslate,
  faultControlInfo,
  faultControlTranslate,
} from 'utils';
import Button from 'components/button/button';
import NextLink from 'next/link';
import { MdAdd, MdOutlineArrowBack } from 'react-icons/md';
import FileViewer from 'components/fileViewer';

export default function Edit() {
  const router = useRouter();
  const { data: session } = useSession();
  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fault, setFault] = useState([]);
  const [faultControl, setFaultControl] = useState({} as any);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSingleFault = async () => {
      setIsLoading(true);
      const { status, data } = await getFaultById(queryParams.id);
      if (status === 200) {
        setFault(data);
        setFaultControl(data?.faultControl[0]);
        setIsLoading(false);
        return;
      }
      setIsSubmitting(false);
    };
    if (queryParams.id) {
      getSingleFault();
    }
  }, [queryParams?.id]);

  const handlefaultControl = () => {
    router.push(`/admin/entry/control/${queryParams?.id}`);
  };

  const renderValues = (key, val) => {
    //TODO: need refactor
    const results = {
      ACCEPT: 'Kabul',
      ACCEPTANCE_WITH_CONDITION: 'Şartlı Kabul',
      PRE_PROCESS: 'Ön İşlem gerekli',
      REJECT: 'Ret',
    };

    if (['createdAt', 'updatedAt'].includes(key)) {
      return <p className="font-bold"> {formatDateTime(val)} </p>;
    }

    if (key === 'productDimension') {
      return <p className="font-bold"> {val ? 'KARIŞIK' : 'DÜZGÜNLİ'} </p>;
    }

    if (key === 'dimensionConfirmation') {
      return <p className="font-bold"> {val ? 'UYGUN' : 'UYGUNSUZ'} </p>;
    }

    if (key === 'quantityConfirmation') {
      return <p className="font-bold"> {val ? 'UYGUN' : 'UYGUNSUZ'} </p>;
    }

    if (key === 'dirtyThreads') {
      return <p className="font-bold"> {val ? 'VAR' : 'YOK'} </p>;
    }

    if (key === 'processFrequency') {
      return <p className="font-bold"> {val ? 'YAZSIN' : 'YAZILMASIN'} </p>;
    }

    if (key === 'result') {
      return <p className="font-bold uppercase"> {results[val]} </p>;
    }
    if (key === 'image') {
      return <FileViewer file={val} />;
    }

    return <p className="font-bold"> {val} </p>;
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <UserFormSkeleton />
      ) : (
        <>
          <div className="flex justify-end">
            <NextLink
              href="/admin/entry"
              className="text-md flex w-fit items-center gap-2 self-start  dark:text-white"
            >
              <span>
                <MdOutlineArrowBack />
              </span>
              Tüm Ürün Girişleri
            </NextLink>
          </div>

          <Card extra="my-12 mx-auto mt-4 w-full rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
            <h2 className="mb-4 text-2xl font-bold">Ürün Bilgileri</h2>
            <div className="mb-10 grid w-full grid-cols-2 gap-2  md:grid-cols-3 lg:grid-cols-4">
              {Object.entries(fault).map(([key, val]: any, index) => {
                if (faultInfo.includes(key)) {
                  return (
                    <div key={index} className="mb-5 flex flex-col flex-nowrap">
                      <h4 className="mx-1 italic">{infoTranslate[key]}</h4>
                      {key === 'arrivalDate' ? (
                        <p className="font-bold"> {formatDateTime(val)} </p>
                      ) : key === 'technicalDrawingAttachment' ? (
                        <FileViewer file={val} />
                      ) : (
                        <p className="font-bold"> {val} </p>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </Card>

          <Card extra="my-12 mx-auto mt-4 w-full rounded-2xl px-8 py-10 bg-white dark:bg-[#111c44] dark:text-white">
            <div className="mb-8 flex justify-between gap-3">
              <h2 className="text-2xl font-bold">Kontrol Bilgileri</h2>

              {session?.user?.role === 'SUPER' ||
              session?.user?.role === 'ADMIN' ? (
                <Button
                  icon={<MdAdd className="mr-1 h-5 w-5" />}
                  extra="max-w-fit px-4  h-[40px]"
                  text={
                    faultControl?.id
                      ? 'ÜRÜN KONTROLÜ DÜZENLE'
                      : 'ÜRÜN KONTROLÜ YAP'
                  }
                  onClick={handlefaultControl}
                />
              ) : null}
            </div>

            {faultControl?.id ? (
              <div className="mb-10 grid w-full grid-cols-2 gap-2  md:grid-cols-3 lg:grid-cols-4">
                {Object.entries(faultControl).map(([key, val]: any, index) => {
                  if (faultControlInfo.includes(key)) {
                    return (
                      <div
                        key={index}
                        className="mb-5 flex flex-col flex-nowrap"
                      >
                        <h4 className="mb-0 italic">
                          {faultControlTranslate[key]}
                        </h4>
                        {renderValues(key, val)}
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="flex h-32 w-full items-center justify-center opacity-75">
                Henüz Ürün Kontrolü yapılamdı
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
