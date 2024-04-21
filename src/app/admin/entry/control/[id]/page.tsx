'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getFaultById,
  addControl,
  getEntryControlByfaultId,
  updateFaultControl,
  addUnacceptable,
  updateUnacceptable,
} from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import EntryControlForm from 'components/forms/faultControl';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import { log } from 'utils';
import Popup from 'components/popup';
import Button from 'components/button/button';
import UnacceptForm from 'components/forms/unaccept';
import SignaturePad from 'components/signaturePad';

type UnacceptInfo = {
  unacceptableStage: string;
  unacceptableDescription: string;
  unacceptableAction: string;
  result: string;
  description: string;
  id: string;
};

export default function EntryControl() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [fault, setFault] = useState({} as any);
  const [faultcontrol, setFaultcontrol] = useState({} as any);
  const { data: session } = useSession();
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [controlValues, setControlValues] = useState([]);
  const [unacceptable, setUnacceptable] = useState({} as UnacceptInfo);
  const [unacceptableFormData, setUnacceptableFormData] = useState({});
  const [isSubmitControl, setIsSubmitControl] = useState(false);
  const [isSubmittingUnaccept, setIsSubmittingUnaccept] = useState(false);

  useEffect(() => {
    const getSingleFault = async () => {
      setIsloading(true);
      const { status, data } = await getFaultById(queryParams.id);
      if (status === 200) {
        setFault(data);
        setFaultcontrol(data?.faultControl ? data?.faultControl[0] : {});
        setUnacceptable(data?.unacceptable ? data?.unacceptable[0] : {});
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
      console.log({ controlValues });
      handleSubmit(controlValues);
    }
  }, [isSubmitControl, controlValues]);

  const handleSubmit = async (val) => {
    const [values, isUpdate] = val;
    if (values.result !== 'ACCEPT' && !isSubmitControl) {
      setControlValues(val);
      setUnacceptableFormData({ fault, unacceptable });
      setIsShowPopUp(true);
      return;
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
        router.push('/admin/entry');
        setIsSubmitting(false);
        return;
      }
    }

    // add new entry control
    const resControl: any = await addControl({
      ...values,
      ...{ createdBy: session?.user?.name },
    });
    const { status, response } = resControl;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Hata oluştu!.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }
    if (status === 200) {
      toast.success('Ürün girişi kontrol işlemi başarılı.');
      router.push('/admin/entry');
      setIsSubmitting(false);
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
        id: unacceptable?.id,
        updatedBy: session?.user?.name,
      });

      if (status === 200) {
        setIsShowPopUp(false);
        toast.success('Uygunsuz kayıt güncelleme işlemi başarılı.');
        setIsSubmitControl(true);
        setIsSubmittingUnaccept(false);
      }

      return;
    }

    //handle new Unacceptable
    const { status, data } = await addUnacceptable({
      ...val,
      faultId: fault.id,
      createdBy: session?.user?.name,
    });
    if (status === 200) {
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
    <Card className="mx-auto mt-4 max-w-[800px] rounded-2xl bg-white px-8 py-10 dark:bg-[#111c44] dark:text-white">
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
          formData={unacceptableFormData as any}
          handleClose={handleClose}
          onSaveUnacceptable={(val) => onSaveUnacceptable(val)}
          isSubmittingUnaccept={isSubmittingUnaccept}
        />
      </Popup>
    </Card>
  );
}
