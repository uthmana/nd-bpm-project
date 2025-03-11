'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  updateProcessControl,
  updateUnacceptable,
  addUnacceptable,
  deleteUnacceptable,
  sendNotification,
  getFaultByIdWithFilter,
  addFinalControl,
} from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { LatestInvoicesSkeleton } from 'components/skeleton';
import { useSession } from 'next-auth/react';
import { log } from 'util';
import Popup from 'components/popup';
import UnacceptForm from 'components/forms/unaccept';
import FinalControl from 'components/forms/finalControl';
import NextLink from 'next/link';
import { MdOutlineArrowBack } from 'react-icons/md';
import { getResError } from 'utils/responseError';

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
  const queryParams = useParams();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [isSubmitControl, setIsSubmitControl] = useState(false);
  const [isSubmittingUnaccept, setIsSubmittingUnaccept] = useState(false);
  const [fault, setFault] = useState({} as any);
  const [finalControlData, setFinalControlData] = useState({} as any);
  const [unacceptable, setUnacceptable] = useState({} as UnacceptInfo);
  const [controlValues, setControlValues] = useState([]);

  useEffect(() => {
    const getFaultById = async () => {
      try {
        setIsloading(true);
        const { data } = await getFaultByIdWithFilter({
          id: queryParams.id,
          filters: {
            customer: true,
            unacceptable: true,
            process: {
              include: {
                technicalParams: true,
                machine: {
                  include: {
                    machineParams: true,
                  },
                },
              },
            },
            finalControl: {
              include: {
                testItem: true,
                testArea: true,
              },
            },
          },
        });

        setFault(data);
        setFinalControlData({
          fault: data,
          finalControl: data?.finalControl?.[0] || {},
          machineName: data?.process?.[0]?.machine?.[0]?.machine_Name || '',
        });

        const defaultUnacceptable = {
          unacceptableStage: 'FINAL',
          createdBy: session?.user?.name,
        };
        const finalUnacceptable = data?.unacceptable?.find(
          (item) => item.unacceptableStage === 'FINAL',
        );
        setUnacceptable(finalUnacceptable || defaultUnacceptable);
        setIsloading(false);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsloading(false);
      }
    };
    if (queryParams.id) {
      getFaultById();
    }
  }, [queryParams?.id]);

  useEffect(() => {
    if (isSubmitControl) {
      handleSubmit(controlValues);
    }
  }, [isSubmitControl, controlValues]);

  const handleSubmit = async (val) => {
    const [values, isUpdate] = val;

    if (!values?.kontrol_edilen_miktar || !values?.nakliye_miktar) {
      toast.error('Lütfen (Kontrol / Nakliye) doldurmalısınız.');
      return;
    }

    if (values.result !== 'ACCEPT' && !isSubmitControl) {
      setControlValues(val);
      setIsShowPopUp(true);
      return;
    }
    try {
      //Handle unacceptable when accepted
      if (values.result === 'ACCEPT' && unacceptable?.id) {
        await deleteUnacceptable(unacceptable?.id);
        toast.success('Uygunsuz kayıt güncelleme işlemi başarılı.');
      }
      setIsSubmitting(true);
      if (isUpdate) {
        let controlUpdateValues = {
          ...values,
          faultId: fault?.id,
          updatedBy: session?.user?.name,
        };

        await updateProcessControl(controlUpdateValues);
        setIsSubmitting(false);
        toast.success('Proses final kontrol güncelleme işlemi başarılı.');
        router.push(`/admin/entry/${fault.id}`);
        return;
      }

      // add new final control
      const _controlValues = {
        ...values,
        faultId: fault?.id,
        createdBy: session?.user?.name,
      };

      const { data } = await addFinalControl(_controlValues);

      if (data.result === 'ACCEPT') {
        await sendNotification({
          workflowId: 'process-control',
          data: {
            link: `${window?.location.origin}/admin/entry/${fault.id}`,
          },
        });
      }
      setIsSubmitting(false);
      toast.success('Final kontrol işlemi başarılı.');
      router.push(`/admin/entry/${fault.id}`);
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
      //handle Unacceptable Update
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
        createdBy: session?.user?.name,
      });

      setUnacceptable(data);
      setIsShowPopUp(false);
      setIsSubmitControl(true);
      setIsSubmittingUnaccept(false);
      toast.success('Uygunsuz kayıt işlemi başarılı.');
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsShowPopUp(false);
      setIsSubmittingUnaccept(false);
      setIsSubmitControl(false);
    }
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
      <div className="mx-auto mt-4 max-w-[900px] rounded-2xl bg-white px-8 py-10 dark:bg-[#111c44] dark:text-white">
        {isLoading ? (
          <LatestInvoicesSkeleton />
        ) : (
          <FinalControl
            data={finalControlData}
            onSubmit={(...val) => handleSubmit(val)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
      <Popup
        show={isShowPopUp}
        extra="flex flex-col gap-3 !top-[50%] py-6 px-8 !w-[90%] md:!w-[700px] !rounded-sm"
      >
        <UnacceptForm
          fault={fault}
          formData={unacceptable as any}
          handleClose={handleClose}
          onSaveUnacceptable={(val) => onSaveUnacceptable(val)}
          isSubmittingUnaccept={isSubmittingUnaccept}
        />
      </Popup>
    </>
  );
}
