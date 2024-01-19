'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProcessById, addProcess } from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import Card from 'components/card';
import Button from 'components/button/button';
import TechParamsTable from 'components/admin/data-tables/techParamsTable';

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [process, setProcess] = useState({} as any);

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

  const handdleAddTechParams = () => {
    const machineMap = {
      // machine1: ['visikosity', 'tset', 'hast'],
      //machine2: ['visikosity', 'tset', 'hast', 'cast'],
      machine3: ['visikosity', 'tset', 'hast', 'last', 'bast'],
    };

    return (
      <div
        className={`grid w-full grid-cols-${machineMap.machine3.length?.toString()} gap-2`}
      >
        {Object.entries(machineMap).map(([key, value], idx) => {
          return value.map((item, index) => {
            return (
              <div className="p-4 " key={index}>
                <p className="font-bold capitalize">{item}</p>
              </div>
            );
          });
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto mt-4 max-w-full rounded-2xl px-2">
      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          <Card extra="w-full lg:w-[220px] p-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-1">
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
          <Card extra="w-full lg:w-[calc(100%-220px)] p-4">
            {process?.status === 'PENDING' ? (
              <div className="mx-auto flex min-h-[200px] max-w-[300px] flex-col items-center justify-center gap-5">
                <p>Henüz Teknik Parametreleri Eklenmedi</p>
                <Button
                  onClick={handdleAddTechParams}
                  extra="h-[40px] py-1 px-2"
                  text="Parametre Ekle"
                />
              </div>
            ) : (
              <div className="w-full">
                <TechParamsTable />
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
