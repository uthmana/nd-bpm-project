'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getProcessById,
  addProcessControl,
  updateProcessControl,
  updateUnacceptable,
  addUnacceptable,
  deleteUnacceptable,
} from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import ProcessControlForm from 'components/forms/processControl';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import { log } from 'util';
import Popup from 'components/popup';
import UnacceptForm from 'components/forms/unaccept';
import FinalControl from 'components/forms/finalControl';
import NextLink from 'next/link';
import { MdOutlineArrowBack } from 'react-icons/md';

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
  const [process, setProcess] = useState({} as any);
  const [processControl, setProcessControl] = useState({} as any);
  const { data: session } = useSession();

  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [controlValues, setControlValues] = useState([]);
  const [unacceptable, setUnacceptable] = useState({} as UnacceptInfo);
  const [unacceptableFormData, setUnacceptableFormData] = useState({});
  const [isSubmitControl, setIsSubmitControl] = useState(false);
  const [isSubmittingUnaccept, setIsSubmittingUnaccept] = useState(false);

  useEffect(() => {
    const getSingleProcess = async () => {
      setIsloading(true);
      const { status, data } = await getProcessById(queryParams.id);
      if (status === 200) {
        setProcess(data);
        setProcessControl(data?.finalControl[0]);
        setUnacceptable(data?.unacceptable[0]);
        setUnacceptableFormData({
          fault: data,
          unacceptable: data?.unacceptable[0],
        });

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

  useEffect(() => {
    if (isSubmitControl) {
      handleSubmit(controlValues);
    }
  }, [isSubmitControl, controlValues]);

  const handleSubmit = async (val) => {
    const [values, isUpdate] = val;

    if (values.result !== 'ACCEPT' && !isSubmitControl) {
      setControlValues(val);
      setUnacceptableFormData({
        fault: process,
        unacceptable: { ...unacceptable, createdBy: session?.user?.name },
      });
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
      const resData: any = await updateProcessControl({
        ...values,
        processId: process.id,
        faultId: process.faultId,
        updatedBy: session?.user?.name,
      });

      const { status, response } = resData;
      if (response?.error) {
        const { message, detail } = response?.error;
        toast.error('Proses final kontrol başarısız.' + message);
        log(detail);
        setIsSubmitting(false);
        return;
      }

      if (status === 200) {
        toast.success('Proses final kontrol güncelleme işlemi başarılı.');
        router.push('/admin/process');
        setIsSubmitting(false);
        return;
      }
    }

    // add new final control
    const resProcess: any = await addProcessControl({
      ...values,
      processId: process.id,
      faultId: process.faultId,
      createdBy: session?.user?.name,
    });

    const { status, response } = resProcess;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Proses final kontrol ekleme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      toast.success('Ürün final kontrol işlemi başarılı.');
      router.push('/admin/process');
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
        processId: process.id,
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
      processId: process.id,
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
    <>
      <NextLink
        href="/admin/process"
        className="mb-3 flex  w-fit items-center gap-2 text-sm dark:text-white"
      >
        <span>
          <MdOutlineArrowBack />
        </span>
        Prosesler
      </NextLink>

      {/* <Card className="mx-auto mb-7 mt-4 max-w-[700px] rounded-2xl bg-white px-8 py-10 dark:bg-[#111c44] dark:text-white">
        {isLoading ? (
          <LatestInvoicesSkeleton />
        ) : (
          <>
            <ProcessControlForm
              title={'Ürün Final Kontrol Formu'}
              info={process}
              data={processControl}
              isSubmitting={isSubmitting}
              onSubmit={(...val) => handleSubmit(val)}
            />
          </>
        )}
      </Card> */}

      <div className="mx-auto mt-4 max-w-[800px] rounded-2xl bg-white px-8 py-10 dark:bg-[#111c44] dark:text-white">
        {isLoading ? (
          <LatestInvoicesSkeleton />
        ) : (
          <FinalControl
            key={process.id}
            data={{
              ...process,
              inspector: session?.user?.name,
              updatedBy: session?.user?.name,
            }}
            onSubmit={(...val) => handleSubmit(val)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

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
    </>
  );
}
