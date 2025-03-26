'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { DetailSkeleton } from 'components/skeleton';
import Card from 'components/card';
import TechParamsTable from 'components/admin/data-tables/techParamsTable';
import Button from 'components/button';
import Popup from 'components/popup';
import { useSession } from 'next-auth/react';
import Select from 'components/select';
import DetailHeader from 'components/detailHeader';
import FileViewer from 'components/fileViewer';
import Barcode from 'react-jsbarcode';
import { getResError } from 'utils/responseError';
import {
  addTechParams,
  updateTechParams,
  deleteTechParams,
  getProcessById,
  updateProcess,
  getMachines,
  sendNotification,
} from 'app/lib/apiRequest';
import {
  faultInfo,
  formatDateTime,
  getProcesstimeByFrequency,
  infoTranslate,
  log,
} from 'utils';

export default function EntryControl() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryParams = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [techParams, setTechParams] = useState([]);
  const [process, setProcess] = useState({} as any);
  const [isTechParams, setIsTechParams] = useState(false);
  const [machineParams, setMachineParams] = useState([]);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [isShowMachinePopUp, setIsShowMachinePopUp] = useState(false);
  const [machines, setMachines] = useState([]);
  const [values, setValues] = useState({} as any);
  const [isFrequencyPopUp, setIsFrequencyPopUp] = useState(false);
  const [defaultTechParams, setDefaultTechParams] = useState({});
  const [fault, setFault] = useState({} as any);
  const [techAttachment, setTechAttachment] = useState([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getSingleProcess = async () => {
    try {
      setIsloading(true);
      const { data } = await getProcessById(queryParams.id);
      const { Fault, machine, technicalParams } = data;
      setFault({ customerName: Fault?.customer?.company_name, ...Fault });
      setProcess(data);
      setTechParams(technicalParams);
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

  useEffect(() => {
    if (queryParams.id) {
      getSingleProcess();
    }
  }, [queryParams?.id]);

  useEffect(() => {
    if (
      !process.id ||
      !process.frequency ||
      process.status === 'FINISHED' ||
      !techParams.length
    ) {
      return;
    }

    const intervalTime = process.frequency * 60000;

    const storedTimes = JSON.parse(
      localStorage.getItem('lastNotificationTimes') || '{}',
    );

    const lastNotificationTime = storedTimes[process.id];

    const now = Date.now();
    const timeSinceLastNotification = lastNotificationTime
      ? now - parseInt(lastNotificationTime)
      : Infinity;
    if (timeSinceLastNotification >= intervalTime) {
      sendNotificationNow();
    } else {
      setTimeout(
        () => sendNotificationNow(),
        intervalTime - timeSinceLastNotification,
      );
    }

    // Start the interval
    intervalRef.current = setInterval(sendNotificationNow, intervalTime);

    return () => {
      clearNotificationInterval();
    };
  }, [process.id, process.frequency, techParams.length]);

  const playSound = () => {
    const audio = new Audio('/audio/intrusive-alert.mp3');
    audio.play();
  };

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
      const storedTimes = JSON.parse(
        localStorage.getItem('lastNotificationTimes') || '{}',
      );
      storedTimes[process.id] = Date.now();
      localStorage.setItem(
        'lastNotificationTimes',
        JSON.stringify(storedTimes),
      );
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      clearInterval(intervalRef.current!);
    }
  };

  const onAddRow = async (val) => {
    if (!process?.machineId) {
      try {
        const { data } = await getMachines();
        setMachines(data);
        setIsShowMachinePopUp(true);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsShowMachinePopUp(false);
      }
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
  const clearNotificationInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      const storedTimes = JSON.parse(
        localStorage.getItem('lastNotificationTimes') || '{}',
      );
      delete storedTimes[process.id];
      localStorage.setItem(
        'lastNotificationTimes',
        JSON.stringify(storedTimes),
      );
    }
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
          link: `${window?.location.origin}/admin/entry/${faultId}`,
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

  const onAddMachine = async () => {
    if (!values?.machineId) return;
    try {
      setIsSubmitting(true);

      await updateProcess({
        id: process.id,
        faultId: process.faultId,
        ...values,
        createdBy: session?.user?.name,
      });

      await getSingleProcess();

      toast.success('Makine ekleme işlemi başarılı.');
      setIsShowMachinePopUp(false);
      setIsSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsShowMachinePopUp(false);
      setIsSubmitting(false);
    }
  };

  const handleValues = (event) => {
    setValues(JSON.parse(event.target?.value));
  };

  const handleOnFinish = () => {
    if (process?.frequency && techParams.length === 0) {
      setIsFrequencyPopUp(true);
      return;
    }
    setIsShowPopUp(true);
  };

  const renderProductInfo = (key, val) => {
    if (key === 'arrivalDate') {
      return <p className="font-bold"> {formatDateTime(val)} </p>;
    }
    if (key === 'arrivalDate') {
      return <p className="font-bold"> {formatDateTime(val)} </p>;
    }
    if (key === 'product_barcode') {
      return (
        <div id="product_barcode" className="max-w-[200px]">
          <Barcode
            className="h-full w-full"
            value={val}
            options={{ format: 'code128' }}
          />
        </div>
      );
    }
    return <p className="break-all font-bold"> {val} </p>;
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
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {fault && fault.id
                ? Object.entries(fault).map(([key, val]: any, index) => {
                    if (faultInfo.includes(key)) {
                      return (
                        <div
                          key={index}
                          className="mb-5 flex flex-col flex-nowrap"
                        >
                          <h4 className="mx-1 italic">{infoTranslate[key]}</h4>
                          <div className="pt-2">
                            {key === 'technicalDrawingAttachment' ? (
                              <span className="flex gap-1">
                                {techAttachment?.map((item, idx) => {
                                  if (!item) return null;
                                  return <FileViewer file={item} key={idx} />;
                                })}
                              </span>
                            ) : (
                              renderProductInfo(key, val)
                            )}
                          </div>
                        </div>
                      );
                    }
                  })
                : null}
              <div className="mb-5 flex flex-col flex-nowrap">
                <h4 className="mx-1 italic">Frekans Aralığı (dk)</h4>
                <p className="text-lg font-bold text-brand-500">
                  {process.frequency ? process.frequency : 'Yazılmasın'}
                </p>
              </div>
            </div>
          </Card>
          <Card extra="w-full px-4 pt-4 pb-8">
            <div className="w-full">
              <div className="my-5 flex justify-between">
                <h2 className="text-2xl font-bold">Frekans Bilgileri</h2>
                {process?.status !== 'FINISHED' ? (
                  <Button
                    extra="max-w-fit px-4 h-[40px]"
                    text="PROSESİ TAMAMLA"
                    onClick={handleOnFinish}
                  />
                ) : null}
              </div>

              <TechParamsTable
                key={isTechParams as any}
                techParams={techParams}
                fields={machineParams}
                defaultTechParams={defaultTechParams}
                status={process?.status}
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
