'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { toast } from 'react-toastify';
import { getFaultById, updateFault } from 'app/lib/apiRequest';
import { DetailSkeleton } from 'components/skeleton';
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
import { MdAdd, MdPrint } from 'react-icons/md';
import FileViewer from 'components/fileViewer';
import DetailHeader from 'components/detailHeader';
import Barcode from 'react-jsbarcode';
import Unaccept from 'components/forms/unaccept';

export default function Edit() {
  const router = useRouter();
  const { data: session } = useSession();
  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fault, setFault] = useState([] as any);
  const [faultControl, setFaultControl] = useState({} as any);
  const [unacceptable, setUnacceptable] = useState({} as any);
  const [isLoading, setIsLoading] = useState(false);

  const detailData = {
    title: 'Ürün Detayi',
    seeAllLink: '/admin/entry',
    seeAllText: 'Tüm Ürünler',
    actionLink: '/admin/entry/create/' + queryParams?.id,
  };

  useEffect(() => {
    const getSingleFault = async () => {
      setIsLoading(true);
      const { status, data } = await getFaultById(queryParams.id);
      if (status === 200) {
        setFault(data);
        setFaultControl(data?.faultControl[0]);
        setUnacceptable({ fault: data, unacceptable: data?.unacceptable[0] });
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
  const renderProductInfo = (key, val) => {
    if (key === 'arrivalDate') {
      return <p className="font-bold"> {formatDateTime(val)} </p>;
    }
    if (key === 'technicalDrawingAttachment') {
      return <FileViewer file={val} />;
    }
    if (key === 'arrivalDate') {
      return <p className="font-bold"> {formatDateTime(val)} </p>;
    }
    if (key === 'product_barcode') {
      return (
        <div id="product_barcode" className="max-w-[200px]">
          <Barcode
            className="h-full w-full"
            value={val}
            options={{ format: 'code128' }}
          />
        </div>
      );
    }
    return <p className="break-all font-bold"> {val} </p>;
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
      return <p className="font-bold"> {val?.toUpperCase()} </p>;
    }

    if (key === 'result') {
      return <p className="font-bold uppercase"> {results[val]} </p>;
    }
    if (key === 'image') {
      return <FileViewer file={val} />;
    }

    return <p className="break-all font-bold "> {val} </p>;
  };

  const handleBarcodePrint = () => {
    const product_barcode =
      document.getElementById('product_barcode').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(
      '<div style="page-break-before: always;"></div>',
    );
    printWindow.document.write(
      '<div style="page-break-before: always;"></div>',
    );
    printWindow.document.write(
      '<div style="page-break-before: always;"></div>',
    );
    printWindow.document.write(product_barcode);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <DetailSkeleton />
      ) : (
        <>
          <DetailHeader {...detailData} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 print:hidden">
            <Card extra="my-4 mx-auto mt-4 w-full rounded-2xl px-8 pt-10 bg-white dark:bg-[#111c44] dark:text-white">
              <div className="mb-4 flex w-full justify-between">
                <h2 className="mb-4 text-2xl font-bold">Ürün Bilgileri</h2>
                <Button
                  extra={`px-4 h-[40px] max-w-fit`}
                  onClick={handleBarcodePrint}
                  text="BARKODU YAZDIR"
                  icon={<MdPrint className="mr-1 h-5 w-5" />}
                />
              </div>
              <div className="mb-10 grid w-full grid-cols-2 gap-2  md:grid-cols-3 lg:grid-cols-4">
                {fault && fault.id
                  ? Object.entries(fault).map(([key, val]: any, index) => {
                      if (faultInfo.includes(key)) {
                        return (
                          <div
                            key={index}
                            className="mb-5 flex flex-col flex-nowrap"
                          >
                            <h4 className="mx-1 italic">
                              {infoTranslate[key]}
                            </h4>
                            {renderProductInfo(key, val)}
                          </div>
                        );
                      }
                    })
                  : null}
              </div>
            </Card>

            <Card extra="mx-auto mb-4 mt-4 w-full rounded-2xl px-8 pt-10 bg-white dark:bg-[#111c44] dark:text-white">
              <div className="mb-8 flex justify-between gap-3">
                <h2 className="text-2xl font-bold">
                  Ürün Giriş Kontrol Bilgileri
                </h2>

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
                  {Object.entries(faultControl).map(
                    ([key, val]: any, index) => {
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
                    },
                  )}
                </div>
              ) : (
                <div className="flex h-32 w-full items-center justify-center opacity-75">
                  Henüz Ürün Kontrolü yapılmadı
                </div>
              )}
            </Card>
          </div>

          {fault?.unacceptable?.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="page-break relative min-h-[800px] w-full bg-white px-7 py-5 print:absolute  print:top-0 print:z-[99999] print:min-h-screen print:w-full print:pl-0 print:pr-8">
                <Unaccept formData={unacceptable} variant="value" />
              </div>
              <div className="!max-w-fit bg-white px-7 py-5 ">
                <Button
                  extra={`px-4 h-[40px] !max-w-fit`}
                  onClick={handlePrint}
                  text="UYGUNSUZ YAZDIR"
                  icon={<MdPrint className="mr-1 h-5 w-5" />}
                />
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
