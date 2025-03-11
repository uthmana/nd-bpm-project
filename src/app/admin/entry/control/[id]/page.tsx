'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  addControl,
  updateFaultControl,
  addUnacceptable,
  updateUnacceptable,
  deleteUnacceptable,
  sendNotification,
  getFaultByIdWithFilter,
} from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import EntryControlForm from 'components/forms/faultControl';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import Popup from 'components/popup';
import UnacceptForm from 'components/forms/unaccept';
import { UnacceptInfo } from 'app/localTypes/table-types';
import { MdOutlineArrowBack } from 'react-icons/md';
import NextLink from 'next/link';
import { Fault } from 'app/localTypes/types';
import { getResError } from 'utils/responseError';

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [fault, setFault] = useState({} as Fault);
  const [faultcontrol, setFaultcontrol] = useState({} as any);
  const { data: session } = useSession();
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [controlValues, setControlValues] = useState([]);
  const [unacceptable, setUnacceptable] = useState({} as UnacceptInfo);
  const [isSubmitControl, setIsSubmitControl] = useState(false);
  const [isSubmittingUnaccept, setIsSubmittingUnaccept] = useState(false);

  useEffect(() => {
    const getSingleFault = async () => {
      try {
        setIsloading(true);
        const { data } = await getFaultByIdWithFilter({
          id: queryParams.id,
          filters: {
            customer: true,
            unacceptable: true,
            faultControl: true,
          },
        });

        setFault(data);
        setFaultcontrol(
          data?.faultControl.length > 0 ? data?.faultControl[0] : {},
        );
        setUnacceptable(
          data?.unacceptable?.length > 0
            ? data?.unacceptable?.find(
                (item) => item.unacceptableStage === 'ENTRY',
              )
            : { unacceptableStage: 'ENTRY', createdBy: session?.user?.name },
        );
        setIsloading(false);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsloading(false);
      }
    };
    if (queryParams.id) {
      getSingleFault();
    }
  }, [queryParams?.id]);

  useEffect(() => {
    if (isSubmitControl) {
      handleSubmit(controlValues);
    }
  }, [isSubmitControl, controlValues]);

  const handleSubmit = async (val) => {
    const [values, isUpdate] = val;
    if (values.result !== 'ACCEPT' && !isSubmitControl) {
      setControlValues(val);
      setIsShowPopUp(true);
      return;
    }

    //Handle unacceptable when accepted
    if (values.result === 'ACCEPT' && unacceptable?.id) {
      try {
        await deleteUnacceptable(unacceptable?.id);
        toast.success('Uygunsuz kayıt güncelleme işlemi başarılı.');
        setIsSubmitting(false);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsSubmitting(false);
      }
    }

    if (isUpdate) {
      try {
        setIsSubmitting(true);
        await updateFaultControl({
          ...values,
          ...{ updatedBy: session?.user?.name },
        });

        toast.success('Ürün kontrol güncelleme işlemi başarılı.');
        router.push(`/admin/entry/${fault?.id}`);
        setIsSubmitting(false);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsSubmitting(false);
      }
      return;
    }

    // add new entry control
    try {
      setIsSubmitting(true);
      const { data } = await addControl({
        ...values,
        ...{ createdBy: session?.user?.name },
      });

      //Notification trigger
      if (data.result !== 'REJECT') {
        await sendNotification({
          workflowId: 'fault-control',
          data: {
            link: `${window?.location.origin}/admin/entry/${data.faultId}`,
          },
        });
      }

      toast.success('Ürün girişi kontrol işlemi başarılı.');
      router.push('/admin/entry');
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };

  const onSaveUnacceptable = async (val) => {
    setIsSubmitControl(false);
    setIsSubmittingUnaccept(true);

    try {
      //handle Update
      if (unacceptable?.id) {
        const { data } = await updateUnacceptable({
          ...val,
          faultId: fault.id,
          updatedBy: session?.user?.name,
        });

        setUnacceptable(data);
        setIsShowPopUp(false);
        setIsSubmitControl(true);
        setIsSubmittingUnaccept(false);
        toast.success('Uygunsuz kayıt güncelleme işlemi başarılı.');
        return;
      }

      //handle new Unacceptable
      const { data } = await addUnacceptable({
        ...val,
        faultId: fault.id,
      });

      setUnacceptable(data);
      setIsShowPopUp(false);
      setIsSubmitControl(true);
      setIsSubmittingUnaccept(false);
      toast.success('Uygunsuz kayıt işlemi başarılı.');
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitControl(true);
      setIsSubmittingUnaccept(false);
    }
  };

  const handleClose = () => {
    setIsSubmitControl(false);
    setIsShowPopUp(false);
  };

  return (
    <>
      <div className="mx-auto flex max-w-[800px] justify-end">
        <NextLink
          href="/admin/entry"
          className="mb-3 flex w-fit items-center gap-2 text-sm dark:text-white"
        >
          <span>
            <MdOutlineArrowBack />
          </span>
          Ürün Girişe
        </NextLink>
      </div>

      <Card className="mx-auto max-w-[800px] rounded-2xl bg-white p-8 dark:bg-[#111c44] dark:text-white">
        {isLoading ? (
          <LatestInvoicesSkeleton />
        ) : (
          <EntryControlForm
            title={'Ürün Girişi Kontrol Formu'}
            info={fault}
            data={faultcontrol}
            isSubmitting={isSubmitting}
            onSubmit={(...val) => handleSubmit(val)}
          />
        )}

        <Popup
          show={isShowPopUp}
          extra="flex flex-col gap-3 !top-[50%] py-6 px-8 !w-[90%] md:!w-[600px] !rounded-sm"
        >
          <UnacceptForm
            fault={fault}
            formData={unacceptable as any}
            handleClose={handleClose}
            onSaveUnacceptable={(val) => onSaveUnacceptable(val)}
            isSubmittingUnaccept={isSubmittingUnaccept}
          />
        </Popup>
      </Card>
    </>
  );
}
