'use client';

import { getInvoiceById } from 'app/lib/apiRequest';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { MdOutlineArrowBack, MdPrint } from 'react-icons/md';
import InvoiceDoc from 'components/invoice';
import Button from 'components/button/button';

export default function Invoice() {
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState({} as any);
  const queryParams = useParams();

  const getSingleInvoice = async (id) => {
    setIsLoading(true);
    const { status, data } = await getInvoiceById(id);
    if (status === 200) {
      setInvoice(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (queryParams?.id) {
      getSingleInvoice(queryParams?.id);
    }
  }, [queryParams?.id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      <div className="mb-10 flex justify-end">
        <NextLink
          href="/admin/invoice"
          className="text-md flex items-center gap-2 self-start  dark:text-white"
        >
          <span>
            <MdOutlineArrowBack />
          </span>
          Tüm İrsaliye
        </NextLink>
      </div>

      {isLoading ? (
        <LatestInvoicesSkeleton />
      ) : (
        <div className="flex w-full flex-wrap gap-5 lg:mx-auto lg:w-[1000px]">
          <InvoiceDoc invoice={invoice} />
          <div>
            <Button
              extra="px-8 h-[40px]"
              onClick={handlePrint}
              text="YAZDIR"
              icon={<MdPrint className="mr-1 h-4 w-4" />}
            />
          </div>
        </div>
      )}
    </div>
  );
}
