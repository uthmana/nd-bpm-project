'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { log } from 'utils';
import { getCustomerById } from 'app/lib/apiRequest';

export default function Edit() {
  const router = useRouter();
  const queryParams = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  // useEffect(() => {
  //   const getSingleCustomer = async () => {
  //     setIsloading(true);
  //     const { status, data } = await getCustomerById(queryParams.id);
  //     if (status === 200) {
  //       setCustomer(data);
  //       setIsloading(false);
  //       return;
  //     }
  //     setIsloading(false);
  //     //TODO: handle error
  //   };
  //   if (queryParams.id) {
  //     getSingleCustomer();
  //   }
  // }, [queryParams?.id]);

  return <div className="mt-12">Müşteri Detayi {queryParams?.id}</div>;
}
