'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DetailSkeleton } from 'components/skeleton';
import Card from 'components/card';
import TechParamsTable from 'components/admin/data-tables/techParamsTable';
import Button from 'components/button';
import Popup from 'components/popup';
import { useSession } from 'next-auth/react';
import Select from 'components/select';
import DetailHeader from 'components/detailHeader';
import FaultInfo from 'components/faultInfo';
import { getResError } from 'utils/responseError';
import { MdVolumeUp } from 'react-icons/md';
import {
  addTechParams,
  updateTechParams,
  deleteTechParams,
  getProcessById,
  updateProcess,
  getMachines,
  sendNotification,
  getFaultById,
  addProcess,
} from 'app/lib/apiRequest';
import {
  formatDateTime,
  getProcesstimeByFrequency,
  log,
  useAudioSound,
} from 'utils';

export default function EntryControl() {
  const router = useRouter();
  const queryParams = useParams();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const newprocess = searchParams.get('newprocess');

  const [isLoading, setIsloading] = useState(false);
  const [startTime, setStartTime] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTechParams, setIsTechParams] = useState(false);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [isShowMachinePopUp, setIsShowMachinePopUp] = useState(false);
  const [isFrequencyPopUp, setIsFrequencyPopUp] = useState(false);

  const [machines, setMachines] = useState([]);
  const [techParams, setTechParams] = useState([]);
  const [machineParams, setMachineParams] = useState([]);
  const [techAttachment, setTechAttachment] = useState([] as any);

  const [fault, setFault] = useState({} as any);
  const [values, setValues] = useState({} as any);
  const [process, setProcess] = useState({} as any);
  const [defaultTechParams, setDefaultTechParams] = useState({});
  const [processMachine, setProcessMachine] = useState({} as any);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isPlaying, playSound, stopSound } = useAudioSound(
    '/audio/intrusive-alert.mp3',
  );

  const getSingleProcess = async () => {
    try {
      setIsloading(true);
      const { data } = await getProcessById(queryParams.id);
      const { Fault, machine, technicalParams } = data;
      setFault({ customerName: Fault?.customer?.company_name, ...Fault });
      setProcess(data);
      setTechParams(technicalParams);
      setProcessMachine(machine?.[0]);
      setDefaultTechParams(Fault?.defaultTechParameter[0] || {});
      setMachineParams(
        machine[0]?.machineParams?.map((item) => item.param_name),
      );

      setTechAttachment([
        data?.technicalDrawingAttachment,
        Fault?.technicalDrawingAttachment,
        Fault.faultControl?.[0].image,
      ]);
      setIsloading(false);
      log(data);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsloading(false);
    }
  };
  const getSingleFault = async (id) => {
    try {
      setIsloading(true);
      const { data } = await getFaultById(id);
      setFault({ customerName: data?.customer?.company_name, ...data });
      setIsloading(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (queryParams.id && newprocess === 'true') {
      getSingleFault(queryParams.id);
    } else {
      getSingleProcess();
    }
  }, [queryParams?.id, newprocess]);

  // Handle requency Notifictaion
  const sendNotificationNow = async () => {
    try {
      await sendNotification({
        workflowId: 'process-frequency',
        data: {
          link: `${window?.location.origin}/process/create/${process.id}`,
          title: 'Proses Frekansı Eklenme',
          description: `${fault?.product} ürünün Proses Frekansı eklenmesi hatırlanmaktadır.`,
          userId: session?.user?.id,
        },
      });
      playSound();
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      clearInterval(intervalRef.current!);
    }
  };
  const clearNotificationInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  useEffect(() => {
    if (!startTime || !process.frequency || process.status === 'FINISHED') {
      clearNotificationInterval();
      return;
    }

    const intervalTime = process.frequency * 60000;
    intervalRef.current = setInterval(sendNotificationNow, intervalTime);
    return () => {
      clearNotificationInterval();
    };
  }, [startTime, process.frequency]);

  const onAddRow = async (val) => {
    if (!process?.machineId) {
      return;
    }
    try {
      setIsTechParams(true);
      const Ort_Uretim_saat = getProcesstimeByFrequency(
        techParams?.at(-1)?.Ort_Uretim_saat,
        process.frequency,
      );

      const { data } = await addTechParams({
        ...val,
        Ort_Uretim_saat,
        processId: queryParams.id,
        machineId: process.machineId,
      });

      setTechParams(data);
      setIsTechParams(false);
      if (!startTime) {
        setStartTime(true);
      }
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsTechParams(false);
    }
  };
  const onUpdateData = async (id, val) => {
    if (!id) return;
    try {
      setIsTechParams(true);
      const { data } = await updateTechParams({
        ...val,
        processId: queryParams.id,
        machineId: process.machineId,
      });
      setTechParams(data);
      setIsTechParams(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsTechParams(false);
    }
  };
  const onRemoveRow = async (id) => {
    try {
      setIsSubmitting(true);
      const { data } = await deleteTechParams(id);
      setTechParams(data);
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
    }
  };
  const onFinishConfirm = () => {
    if (process?.frequency && techParams.length === 0) {
      setIsFrequencyPopUp(true);
      return;
    }
    setIsShowPopUp(true);
  };
  const onFinish = async () => {
    const { id, faultId } = process;
    if (!id || !faultId) return;
    try {
      setIsSubmitting(true);
      clearNotificationInterval();

      await updateProcess({
        id,
        faultId,
        status: 'FINISHED',
        updatedBy: session?.user?.name,
      });

      await sendNotification({
        workflowId: 'process-completion',
        data: {
          link: `${window?.location.origin}/admin/invoice`,
          title: 'Proses Tamamlanma',
          description: `${fault?.customerName} için ${fault?.product} ürününün prosesi tamamlandı`,
        },
      });

      setIsShowPopUp(false);
      setIsSubmitting(false);
      router.push(`/admin/entry/${faultId}`);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsSubmitting(false);
      setIsShowPopUp(false);
    }
  };

  const handleFinalControl = () => {
    router.push(`/admin/process/control/${fault?.id}`);
  };

  // Handle new Process Machine
  const handleMachinePopup = async () => {
    try {
      const { data } = await getMachines();
      setMachines(data);
      setIsShowMachinePopUp(true);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsShowMachinePopUp(false);
    }
  };
  const handleValues = (event) => {
    setValues(JSON.parse(event.target?.value));
  };
  const onAddMachine = async () => {
    const frequency = fault?.faultControl?.[0].frequencyDimension;
    const { machineName, machineId } = values;
    const val = {
      frequency,
      machineName,
      machineId,
      faultId: fault.id,
      createdBy: session?.user?.name,
    };
    try {
      setIsSubmitting(true);
      const { data } = await addProcess(val);
      router.push(`/admin/process/create/${data.id}`);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsShowMachinePopUp(false);
    }
  };

  const detailData = {
    title: 'Detay',
    seeAllLink: '/admin/process',
    seeAllText: 'Tüm Proses',
    actionText: 'ÜRÜN DETAY',
    actionLink: `/admin/entry/${fault?.id}`,
  };

  return (
    <div className="mx-auto mt-4 max-w-full rounded-2xl px-2">
      {isLoading ? (
        <DetailSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          <DetailHeader {...detailData} />
          <Card extra="w-full px-4 pt-4 pb-8">
            <h2 className="my-5 text-2xl font-bold">Ürün Bilgileri</h2>
            <FaultInfo
              fault={fault}
              techAttachments={techAttachment}
              frequency={process.frequency ? process.frequency : 'Yazılmasın'}
            />
          </Card>
          <Card extra="w-full px-4 pt-4 pb-8">
            <div className="w-full">
              <div className="my-5 flex w-full justify-between">
                <h2 className="text-2xl font-bold">
                  Frekans Bilgileri
                  {processMachine?.machine_Name ? (
                    <span>
                      {' '}
                      |{' '}
                      <span className="text-brand-500">
                        {processMachine?.machine_Name}
                      </span>
                    </span>
                  ) : null}
                </h2>

                <div className="flex gap-3">
                  {isPlaying ? (
                    <span>
                      <Button
                        extra="max-w-fit px-4 h-[40px]"
                        text=""
                        onClick={() => stopSound()}
                        icon={<MdVolumeUp className="h-5 w-5" />}
                      />
                    </span>
                  ) : null}

                  {!process?.id ? (
                    <Button
                      extra="max-w-fit px-4 h-[40px]"
                      text="MAKİNE SEÇ"
                      onClick={handleMachinePopup}
                    />
                  ) : null}

                  {process?.id && process?.status !== 'FINISHED' ? (
                    <Button
                      extra="max-w-fit px-4 h-[40px]"
                      text="PROSESİ TAMAMLA"
                      onClick={onFinishConfirm}
                    />
                  ) : null}

                  {process?.status === 'FINISHED' ? (
                    <Button
                      extra="max-w-fit px-4 h-[40px]"
                      text="FINAL KONTROL YAP"
                      onClick={handleFinalControl}
                    />
                  ) : null}
                </div>
              </div>

              <TechParamsTable
                key={isTechParams as any}
                techParams={techParams}
                fields={machineParams}
                defaultTechParams={defaultTechParams}
                status={
                  !machineParams?.length || !process.frequency
                    ? 'FINISHED'
                    : process?.status
                }
                onUpdateData={(id, val) => onUpdateData(id, val)}
                onAddRow={(val) => onAddRow(val)}
                onRemoveRow={(val) => onRemoveRow(val)}
              />
            </div>
          </Card>

          <div className="mt-8 flex justify-between text-sm font-bold opacity-60">
            <div>
              <p>Oluşturan: {process?.createdBy}</p>
              <p>
                Oluşturulma Tarihi:{' '}
                {process?.createdAt ? formatDateTime(process?.createdAt) : ''}
              </p>
            </div>
            <div>
              <p>Güncelleyen: {process?.updatedBy}</p>
              <p>
                Güncelleme Tarihi:{' '}
                {process?.updatedAt ? formatDateTime(process?.updatedAt) : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      <Popup show={isFrequencyPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Proses Tamamlama</h1>
        <p className="mb-2 text-lg  text-red-500">
          Frekans bilgileri girmeniz gerekiyor !
        </p>
        <div className="flex gap-4">
          <Button
            text="GERİ"
            extra="w-[60px] h-[40px]"
            onClick={() => setIsFrequencyPopUp(false)}
          />
        </div>
      </Popup>

      <Popup show={isShowPopUp} extra="flex flex-col gap-3 py-6 px-8">
        <h1 className="text-3xl">Proses Tamamlama</h1>
        <p className="mb-2 text-lg">
          Bu Prosesi tamamlamak istediğini Emin misin ?
        </p>
        <div className="flex gap-4">
          <Button
            loading={isSubmitting}
            text="EVET"
            extra="w-[60px]  h-[40px]"
            onClick={onFinish}
          />
          <Button
            text="HAYIR"
            extra="w-[60px] h-[40px] bg-red-700"
            onClick={() => setIsShowPopUp(false)}
          />
        </div>
      </Popup>

      <Popup
        key={1}
        show={isShowMachinePopUp}
        extra="flex flex-col gap-3 py-6 px-8"
      >
        <h1 className="text-3xl">Makine Şeçimi</h1>
        <div className="mb-2 flex flex-col gap-3 sm:flex-row">
          <Select
            extra="pt-1"
            label="Makine Seçimi"
            onChange={handleValues}
            name="machineName"
          >
            <option value="{}" selected>
              Makine Seç
            </option>
            {machines.map((item, idx) => {
              return (
                <option
                  value={JSON.stringify({
                    machineId: item.id,
                    machineName: item.machine_Name,
                  })}
                  key={idx}
                >
                  {item.machine_Name}
                </option>
              );
            })}
          </Select>
        </div>

        <div className="flex gap-4">
          <Button
            text="GERİ"
            extra="w-[60px] bg-red-700 h-[40px]"
            onClick={() => setIsShowMachinePopUp(false)}
          />
          <Button
            loading={isSubmitting}
            text="DEVAM"
            extra="w-[60px] h-[40px]"
            onClick={onAddMachine}
          />
        </div>
      </Popup>
    </div>
  );
}
