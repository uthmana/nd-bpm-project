'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFaultById, getHistoryById } from 'app/lib/apiRequest';
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

import HistoryForm, { MetaData } from 'components/forms/history';

export default function History() {
  const queryParams = useParams();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([] as any);
  const detailData = {
    title: 'Ürün Detayi',
    seeAllLink: '/admin/entry',
    seeAllText: 'Tüm Ürünler',
    actionLink: '/admin/entry/create/' + queryParams?.id,
  };

  useEffect(() => {
    const getSinglehistory = async () => {
      setIsLoading(true);
      const { status, data } = await getHistoryById(queryParams.id);
      if (status === 200) {
        setHistory(data);
        setIsLoading(false);
        return;
      }
      setIsSubmitting(false);
    };

    if (queryParams.id) {
      getSinglehistory();
    }
  }, [queryParams?.id]);

  return (
    <div className="w-full">
      <HistoryForm formData={history} />
    </div>
  );
}
