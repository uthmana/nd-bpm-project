'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProcessById, addProcess } from 'app/lib/apiRequest';
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

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [techParams, setTechParams] = useState([]);
  const [process, setProcess] = useState({} as any);
  const [isTechParams, setIsTechParams] = useState(false);

  //TODO: Seed machine data
  const requiredFields = ['saat', 'viskozite', 'besleme_Tipi', 'purge_Ayari'];

  const productInfo = [
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
  };

  useEffect(() => {
    const getSingleProcess = async () => {
      setIsloading(true);
      const { status, data } = await getProcessById(queryParams.id);
      if (status === 200) {
        setProcess(data);
        setTechParams(data?.technicalParams);
        setIsloading(false);
        return;
      }
      setIsloading(true);
      //TODO: handle error
    };
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
  const handleFinishProcess = async (val) => {
    alert('Process finished !');
  };

  return (
    <div className="mx-auto mt-4 max-w-full rounded-2xl px-2">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <div className="flex flex-col gap-8">
          <Card extra="w-full p-4">
            <h2 className="my-5 text-2xl font-bold">Ürün Bilgileri</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
                <Button
                  extra="max-w-fit px-4 uppercase h-[40px] bg-green-700 hover:bg-green-800"
                  text="Proses Tamamla"
                  onClick={handleFinishProcess}
                />
              </div>

              <TechParamsTable
                key={isTechParams as any}
                fields={requiredFields}
                techParams={techParams}
                onUpdateData={(id, val) => onUpdateData(id, val)}
                onAddRow={(val) => onAddRow(val)}
                onRemoveRow={(val) => onRemoveRow(val)}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
