'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getFaultById } from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { formatDateTime } from 'utils';

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [fault, setFault] = useState([]);

  useEffect(() => {
    const getSingleFault = async () => {
      setIsloading(true);
      const { status, data } = await getFaultById(queryParams.id);
      if (status === 200) {
        console.log(data);
        setFault(data);
        setIsloading(false);
        return;
      }
      setIsSubmitting(false);
      //TODO: handle error
    };
    if (queryParams.id) {
      getSingleFault();
    }
  }, [queryParams?.id]);

  return (
    <div className="mx-auto mt-4 max-w-[700px]">
      <h1 className="mb-3 text-center text-4xl font-bold">
        Ürün Girişi Kontrol Formu
      </h1>

      <div className="flex w-full flex-wrap gap-4">
        <div className="flex w-full flex-nowrap justify-between gap-2 sm:w-[50%] md:w-[30%]">
          <h2>Müşteri no.</h2>
          <p className="font-bold"> {fault.traceabilityCode} </p>
        </div>

        <div className="flex w-full flex-nowrap justify-between gap-2 sm:w-[50%] md:w-[30%]">
          <h2>Ürün Tanımı</h2>
          <p className="font-bold underline underline-offset-1">
            {fault.faultDescription}
          </p>
        </div>

        <div className="flex w-full flex-nowrap justify-between gap-2 sm:w-[50%] md:w-[30%]">
          <h2>Ürün Kodu.</h2>
          <p className="font-bold"> {fault.productCode} </p>
        </div>

        <div className="flex w-full flex-nowrap justify-between gap-2 sm:w-[50%] md:w-[30%]">
          <h2>Şipariş No.</h2>
          <p className="font-bold"> {fault.productBatchNumber} </p>
        </div>

        <div className="flex w-full flex-nowrap justify-between gap-2 sm:w-[50%] md:w-[30%]">
          <h2>Miktar</h2>
          <p className="font-bold"> {fault.quantity} </p>
        </div>

        <div className="flex w-full flex-nowrap justify-between gap-2 sm:w-[50%] md:w-[30%]">
          <h2>Palet</h2>
          <p className="font-bold"> {fault.product} </p>
        </div>

        <div className="flex w-full flex-nowrap justify-between gap-2 sm:w-[50%] md:w-[30%]">
          <h2>Personel</h2>
          <p className="font-bold"> {fault.product} </p>
        </div>

        <div className="flex w-full flex-nowrap justify-between gap-2 sm:w-[50%] md:w-[30%]">
          <h2>Tarih</h2>
          <p className="font-bold"> {formatDateTime(new Date())} </p>
        </div>
      </div>
    </div>
  );
}
