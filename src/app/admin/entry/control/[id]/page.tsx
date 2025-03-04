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
import { log } from 'utils';
import Popup from 'components/popup';
import UnacceptForm from 'components/forms/unaccept';
import { UnacceptInfo } from 'app/localTypes/table-types';
import { MdOutlineArrowBack } from 'react-icons/md';
import NextLink from 'next/link';
import { Fault } from 'app/localTypes/types';

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
      setIsloading(true);

      const { status, data } = await getFaultByIdWithFilter({
        id: queryParams.id,
        filters: {
          customer: true,
          unacceptable: true,
          faultControl: true,
        },
      });

      if (status === 200) {
        console.log(data);
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
        return;
      }
      setIsloading(true);
      //TODO: handle error
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
      const { status, data } = await deleteUnacceptable(unacceptable?.id);
      if (status === 200) {
        toast.success('Uygunsuz kayıt güncelleme işlemi başarılı.');
      }
    }

    setIsSubmitting(true);
    if (isUpdate) {
      const resData: any = await updateFaultControl({
        ...values,
        ...{ updatedBy: session?.user?.name },
      });

      const { status, response } = resData;
      if (response?.error) {
        const { message, detail } = response?.error;
        toast.error('Hata oluştu!.' + message);
        log(detail);
        setIsSubmitting(false);
        return;
      }

      if (status === 200) {
        toast.success('Ürün kontrol güncelleme işlemi başarılı.');
        router.push(`/admin/entry/${fault?.id}`);
        setIsSubmitting(false);
        return;
      }
    }

    // add new entry control
    const resControl: any = await addControl({
      ...values,
      ...{ createdBy: session?.user?.name },
    });
    const { status, response, data } = resControl;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Hata oluştu!.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }
    if (status === 200) {
      toast.success('Ürün girişi kontrol işlemi başarılı.');
      setIsSubmitting(false);
      //Notification trigger
      if (data.result !== 'REJECT') {
        try {
          await sendNotification({
            workflowId: 'fault-control',
            data: {
              link: `${window?.location.origin}/admin/entry/${data.faultId}`,
            },
          });
        } catch (err) {
          console.log(err);
        }
      }

      router.push('/admin/entry');
      return;
    }
  };

  const onSaveUnacceptable = async (val) => {
    setIsSubmitControl(false);
    setIsSubmittingUnaccept(true);

    //handle Update
    if (unacceptable?.id) {
      const { status, data } = await updateUnacceptable({
        ...val,
        faultId: fault.id,
        updatedBy: session?.user?.name,
      });

      if (status === 200) {
        setUnacceptable(data);
        setIsShowPopUp(false);
        setIsSubmitControl(true);
        setIsSubmittingUnaccept(false);
        toast.success('Uygunsuz kayıt güncelleme işlemi başarılı.');
      }

      return;
    }

    //handle new Unacceptable
    const { status, data } = await addUnacceptable({
      ...val,
      faultId: fault.id,
    });
    if (status === 200) {
      setUnacceptable(data);
      setIsShowPopUp(false);
      toast.success('Uygunsuz kayıt işlemi başarılı.');
      setIsSubmitControl(true);
      setIsSubmittingUnaccept(false);
    }

    return;
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
