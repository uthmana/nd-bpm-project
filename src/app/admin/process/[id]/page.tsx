'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProcessById, addProcess, updateProcess } from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import Card from 'components/card';
import TechParamsTable from 'components/admin/data-tables/techParamsTable';
import {
  addTechParams,
  updateTechParams,
  deleteTechParams,
} from 'app/lib/apiRequest';
import Button from 'components/button/button';
import Popup from 'components/popup';
import { formatDateTime } from 'utils';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { MdOutlineArrowBack } from 'react-icons/md';

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [techParams, setTechParams] = useState([]);
  const [process, setProcess] = useState({} as any);
  const [isTechParams, setIsTechParams] = useState(false);
  const [machineParams, setMachineParams] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { data: session } = useSession();

  const productInfo = [
    'faultId',
    'customerName',
    'product',
    'quantity',
    'application',
    'standard',
    'color',
    'machineName',
  ];

  const infoTranslate = {
    customerName: 'Müşteri',
    product: 'Ürün adı',
    quantity: 'Miktar',
    application: 'Uygulama',
    standard: 'Standart',
    color: 'Renk',
    machineName: 'Makine',
    faultId: 'Takıp Kodu',
  };

  const getSingleProcess = async () => {
    setIsloading(true);
    const { status, data } = await getProcessById(queryParams.id);
    if (status === 200) {
      if (data?.machineParams?.length === 0) {
        //TODO: show  Popup
        alert('Makine seçmeniz gerekiyor!');
        return;
      }
      setProcess(data);
      setTechParams(data?.technicalParams);
      setMachineParams(data.machineParams.map((item) => item.param_name));
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

  const handleSubmit = async (val) => {
    const [values] = val;
    setIsSubmitting(true);
    // add new entry control
    const { status, data, response } = await addProcess(values);
    if (status === 200) {
      toast.success('Ürün girişi kontrol işlemi başarılı.');
      router.push('/admin/process');
      setIsSubmitting(false);
      return;
    }
    toast.error('Hata oluştu!.' + { response });
    setIsSubmitting(false);
  };

  const onUpdateData = async (id, val) => {
    if (!id) return;
    setIsTechParams(true);
    const { status, data } = await updateTechParams(val);
    if (status === 200) {
      setTechParams(data);
      setIsTechParams(false);
      return;
    }
  };

  const onAddRow = async (val) => {
    setIsTechParams(true);
    const { status, data } = await addTechParams({
      ...val,
      processId: queryParams.id,
      machineId: process.machineId,
    });
    if (status === 200) {
      setTechParams(data);
      setIsTechParams(false);
      return;
    }
  };
  const onRemoveRow = async (val) => {
    const { status, data } = await deleteTechParams(val);
    if (status === 200) {
      setTechParams(data);
      return;
    }
  };

  const onFinish = async () => {
    const { id, faultId } = process;
    const { status } = await updateProcess({
      id,
      faultId,
      status: 'FINISHED',
      updatedBy: session?.user?.name,
    });
    if (status === 200) {
      await getSingleProcess();
      setIsShowPopUp(false);
    }
  };

  return (
    <div className="mx-auto mt-4 max-w-full rounded-2xl px-2">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <div className="flex flex-col gap-8">
          <NextLink
            href="/admin/process"
            className="text-md flex items-center gap-2 self-end  dark:text-white"
          >
            <span>
              <MdOutlineArrowBack />
            </span>
            Tüm Prosesleri
          </NextLink>

          <Card extra="w-full p-4">
            <h2 className="my-5 text-2xl font-bold">Ürün Bilgileri</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {Object.entries(process).map(([key, value], idx) => {
                if (productInfo.includes(key)) {
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
          <Card extra="w-full p-4">
            <div className="w-full">
              <div className="my-5 flex justify-between">
                <h2 className="text-2xl font-bold">Teknik Parametreleri</h2>
                {process?.status !== 'FINISHED' ? (
                  <Button
                    extra="max-w-fit px-4  h-[40px] bg-green-700 hover:bg-green-800"
                    text="PROSESİ TAMAMLA"
                    onClick={() => setIsShowPopUp(true)}
                  />
                ) : null}
              </div>

              <TechParamsTable
                key={isTechParams as any}
                fields={machineParams}
                techParams={techParams}
                status={process?.status}
                onUpdateData={(id, val) => onUpdateData(id, val)}
                onAddRow={(val) => onAddRow(val)}
                onRemoveRow={(val) => onRemoveRow(val)}
              />
            </div>
          </Card>

          <div className="mt-8 flex justify-between text-sm font-bold opacity-60">
            <div>
              <p>Oluşturan: {process?.createdBy}</p>
              <p>
                Oluşturulma Tarihi:{' '}
                {process?.createdAt ? formatDateTime(process?.createdAt) : ''}
              </p>
            </div>
            <div>
              <p>Güncelleyen: {process?.updatedBy}</p>
              <p>
                Güncelleme Tarihi:{' '}
                {process?.updatedAt ? formatDateTime(process?.updatedAt) : ''}
              </p>
            </div>
          </div>
        </div>
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
