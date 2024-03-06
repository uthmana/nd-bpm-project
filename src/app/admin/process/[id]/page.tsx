'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProcessById, updateProcess } from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { DetailSkeleton } from 'components/skeleton';
import Card from 'components/card';
import TechParamsTable from 'components/admin/data-tables/techParamsTable';
import {
  addTechParams,
  updateTechParams,
  deleteTechParams,
} from 'app/lib/apiRequest';
import Button from 'components/button/button';
import Popup from 'components/popup';
import { formatDateTime, log } from 'utils';
import { useSession } from 'next-auth/react';
import { MdAdd, MdPrint } from 'react-icons/md';
import FileViewer from 'components/fileViewer';
import DetailHeader from 'components/detailHeader';
import Barcode from 'react-jsbarcode';

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [techParams, setTechParams] = useState([]);
  const [process, setProcess] = useState({} as any);
  const [isTechParams, setIsTechParams] = useState(false);
  const [machineParams, setMachineParams] = useState([]);
  const [finalControl, setFinalControl] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { data: session } = useSession();

  const productInfo = [
    'product_barcode',
    'customerName',
    'product',
    'quantity',
    'application',
    'standard',
    'color',
    'machineName',
  ];

  const detailData = {
    title: 'Proses Detayi',
    seeAllLink: '/admin/process',
    seeAllText: 'Tüm Proses',
  };

  const infoTranslate = {
    customerName: 'Müşteri',
    product: 'Ürün adı',
    quantity: 'Miktar',
    application: 'Uygulama',
    standard: 'Standart',
    color: 'Renk',
    machineName: 'Makine',
    product_barcode: 'Barkodu',
  };

  const getSingleProcess = async () => {
    setIsloading(true);
    const { status, data } = await getProcessById(queryParams.id);
    if (status === 200) {
      setProcess(data);
      setTechParams(data?.technicalParams);
      setMachineParams(data.machineParams.map((item) => item.param_name));
      setFinalControl(data?.finalControl);
      setIsloading(false);
      return;
    }
    setIsloading(false);
    //TODO: handle error
  };

  useEffect(() => {
    if (queryParams.id) {
      getSingleProcess();
    }
  }, [queryParams?.id]);

  const onUpdateData = async (id, val) => {
    if (!id) return;
    setIsTechParams(true);
    const resData: any = await updateTechParams(val);
    const { status, data, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Ürün güncelleme başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      setTechParams(data);
      setIsTechParams(false);
      return;
    }
  };

  const onAddRow = async (val) => {
    setIsTechParams(true);
    const resData: any = await addTechParams({
      ...val,
      processId: queryParams.id,
      machineId: process.machineId,
    });

    const { status, data, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Parametre ekleme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      setTechParams(data);
      setIsTechParams(false);
      return;
    }
  };

  const onRemoveRow = async (val) => {
    const resData: any = await deleteTechParams(val);
    const { status, data, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Parametre silme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      setTechParams(data);
      return;
    }
  };

  const onFinish = async () => {
    const { id, faultId } = process;
    if (!id || !faultId) return;
    setIsSubmitting(true);
    const resData: any = await updateProcess({
      id,
      faultId,
      status: 'FINISHED',
      updatedBy: session?.user?.name,
    });
    const { status, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Proses güncelleme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      await getSingleProcess();
      setIsShowPopUp(false);
    }
  };

  const handleProcessControl = () => {
    router.push(`/admin/process/control/${process.id}`);
  };

  const handleComplete = () => {
    router.push(`/admin/process/create/${process.id}`);
  };

  const processInfo = [
    'product_barcode',
    'olcu_Kontrol',
    'gorunum_kontrol',
    'tork_Kontrol',
    'paketleme',
    'kontrol_edilen_miktar',
    'hatali_miktar',
    'nakliye_miktar',
    'remarks',
    'image',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'result',
  ];

  const infoProcessTranslate = {
    product_barcode: 'Barkodu',
    olcu_Kontrol: 'Ölçü',
    gorunum_kontrol: 'Görünüm',
    tork_Kontrol: 'Tork',
    paketleme: 'Paketleme',
    kontrol_edilen_miktar: 'Kontrol edilen miktari',
    hatali_miktar: 'Hatali Miktari',
    nakliye_miktar: 'Nakliye Miktari',
    remarks: 'Açıklama',
    createdAt: 'Oluşturma Tarihi',
    updatedAt: 'Güncellenme Tarihi',
    createdBy: 'Oluşturan',
    updatedBy: 'Güncelleyen',
    image: 'İlgili Doküman',
    result: 'Sonuç',
  };

  const renderValues = (key, val) => {
    const results = {
      ACCEPT: 'Kabul',
      ACCEPTANCE_WITH_CONDITION: 'Şartlı Kabul',
      PRE_PROCESS: 'Ön İşlem gerekli',
      REJECT: 'Ret',
    };

    if (['createdAt', 'updatedAt'].includes(key)) {
      return <p className="font-bold"> {formatDateTime(val)} </p>;
    }

    if (['olcu_Kontrol', 'gorunum_kontrol', 'tork_Kontrol'].includes(key)) {
      return (
        <p className="font-bold"> {val === 'NOT_OK' ? 'İYİ DEĞİL' : 'İYİ'} </p>
      );
    }

    if (key === 'result') {
      return <p className="font-bold uppercase"> {results[val]} </p>;
    }
    if (key === 'image') {
      return <FileViewer file={val} />;
    }
    return <p className="font-bold"> {val} </p>;
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

  return (
    <div className="mx-auto mt-4 max-w-full rounded-2xl px-2">
      {isLoading ? (
        <DetailSkeleton />
      ) : (
        <>
          <DetailHeader {...detailData} />
          <div className="flex flex-col gap-4">
            {/* Product Info */}
            <Card extra="w-full px-8 pt-4 pb-8">
              <div className="mb-4 flex w-full justify-between">
                <h2 className="mb-4 text-2xl font-bold">Ürün Bilgileri</h2>
                <Button
                  extra={`px-4 h-[40px] max-w-[200px]`}
                  onClick={handleBarcodePrint}
                  text="BARKODU YAZDIR"
                  icon={<MdPrint className="mr-1 h-5 w-5" />}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {Object.entries(process).map(([key, value], idx) => {
                  if (productInfo.includes(key)) {
                    if (key === 'product_barcode') {
                      return (
                        <div
                          id="product_barcode"
                          className="max-w-[200px]"
                          key={idx}
                        >
                          <h2 className="mb-0 font-bold capitalize italic">
                            {infoTranslate[key]}
                          </h2>
                          <Barcode
                            className="h-full w-full"
                            value={value.toString()}
                            options={{ format: 'code128' }}
                          />
                        </div>
                      );
                    }

                    return (
                      <div className="" key={idx}>
                        <h2 className="font-bold capitalize italic">
                          {infoTranslate[key]}
                        </h2>
                        <> {value}</>
                      </div>
                    );
                  }
                })}
              </div>
            </Card>

            {/* Tecknical Params */}
            <Card extra="w-full px-8 pt-4 pb-8">
              <div className="w-full">
                <div className="my-5 flex justify-between">
                  <h2 className="text-2xl font-bold">Frekans Bilgileri</h2>
                  {process?.status !== 'FINISHED' &&
                  (finalControl.length === 0 ||
                    finalControl[0].result !== 'ACCEPT') &&
                  (session?.user?.role === 'TECH' ||
                    session?.user?.role === 'ADMIN') ? (
                    <Button
                      icon={<MdAdd className="mr-1 h-5 w-5" />}
                      extra="max-w-fit px-4  h-[40px]"
                      text={`${
                        techParams.length > 0
                          ? 'PARAMETRE DÜZENLE'
                          : 'PARAMETRE EKLE'
                      }`}
                      onClick={handleComplete}
                    />
                  ) : null}
                </div>

                <TechParamsTable
                  key={isTechParams as any}
                  fields={machineParams}
                  techParams={techParams}
                  status={'FINISHED'}
                  onUpdateData={(id, val) => onUpdateData(id, val)}
                  onAddRow={(val) => onAddRow(val)}
                  onRemoveRow={(val) => onRemoveRow(val)}
                />
              </div>

              <div className="mt-8 flex justify-between text-sm font-bold opacity-60">
                <div>
                  <p>Oluşturan: {process?.createdBy}</p>
                  <p>
                    Oluşturulma Tarihi:{' '}
                    {process?.createdAt
                      ? formatDateTime(process?.createdAt)
                      : ''}
                  </p>
                </div>
                <div>
                  <p>Güncelleyen: {process?.updatedBy}</p>
                  <p>
                    Güncelleme Tarihi:{' '}
                    {process?.updatedAt
                      ? formatDateTime(process?.updatedAt)
                      : ''}
                  </p>
                </div>
              </div>
            </Card>

            {/* Form  COntrol */}
            <Card extra="w-full px-8 pt-4 pb-8">
              <div className="w-full">
                <div className="my-5 flex justify-between">
                  <h2 className="text-2xl font-bold">
                    Final Kontrol Bilgileri
                  </h2>

                  {process.status === 'FINISHED' &&
                  (session?.user?.role === 'SUPER' ||
                    session?.user?.role === 'ADMIN') ? (
                    <Button
                      icon={<MdAdd className="mr-1 h-5 w-5" />}
                      extra="max-w-fit px-4  h-[40px]"
                      text={`${
                        finalControl.length > 0
                          ? 'FİNAL KONTROLÜ DÜZENLE'
                          : 'FİNAL KONTROLÜ YAP'
                      } `}
                      onClick={handleProcessControl}
                    />
                  ) : null}
                </div>
                {finalControl.length === 0 ? (
                  <div className="flex h-32 w-full items-center justify-center opacity-40">
                    Henüz final kontrolü yapılmadı
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {Object.entries(finalControl[0]).map(
                      ([key, val]: any, index) => {
                        if (processInfo.includes(key)) {
                          return (
                            <div
                              key={index}
                              className="mb-3 flex flex-col flex-nowrap"
                            >
                              <h4 className="mb-0 italic">
                                {infoProcessTranslate[key]}
                              </h4>
                              {renderValues(key, val)}
                            </div>
                          );
                        }
                      },
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}

      <Popup show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Proses Tamamlama</h1>
        <p className="mb-2 text-lg">
          Bu Prosesi tamamlamak istediğini Emin misin ?
        </p>
        <div className="flex gap-4">
          <Button
            loading={isSubmitting}
            text="EVET"
            extra="w-[60px]  h-[40px]"
            onClick={onFinish}
          />
          <Button
            text="HAYIR"
            extra="w-[60px] h-[40px] bg-red-700"
            onClick={() => setIsShowPopUp(false)}
          />
        </div>
      </Popup>
    </div>
  );
}
