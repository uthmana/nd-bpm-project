'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getProcessById,
  addProcess,
  updateProcess,
  getMachines,
} from 'app/lib/apiRequest';
import { useParams, useRouter } from 'next/navigation';
import { DetailSkeleton } from 'components/skeleton';
import Card from 'components/card';
import TechParamsTable from 'components/admin/data-tables/techParamsTable';
import {
  addTechParams,
  updateTechParams,
  deleteTechParams,
} from 'app/lib/apiRequest';
import Button from 'components/button/button';
import Popup from 'components/popup';
import { formatDateTime, log } from 'utils';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { MdAdd, MdOutlineArrowBack } from 'react-icons/md';
import Select from 'components/select/page';
import DetailHeader from 'components/detailHeader';

export default function EntryControl() {
  const router = useRouter();
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
  const { data: session } = useSession();
  const [isFrequencyPopUp, setIsFrequencyPopUp] = useState(false);
  const [defaultTechParams, setDefaultTechParams] = useState({});

  const productInfo = [
    'faultId',
    'customerName',
    'product',
    'quantity',
    'application',
    'standard',
    'color',
    'machineName',
  ];

  const infoTranslate = {
    customerName: 'Müşteri',
    product: 'Ürün adı',
    quantity: 'Miktar',
    application: 'Uygulama',
    standard: 'Standart',
    color: 'Renk',
    machineName: 'Makine',
    faultId: 'Takıp Kodu',
  };

  const detailData = {
    title: 'Proses Detayi',
    seeAllLink: '/admin/process',
    seeAllText: 'Tüm Proses',
  };

  const getSingleProcess = async () => {
    setIsloading(true);
    const { status, data } = await getProcessById(queryParams.id);
    if (status === 200) {
      setProcess(data);
      setTechParams(data?.technicalParams);
      setMachineParams(data.machineParams.map((item) => item.param_name));
      setDefaultTechParams(data?.defaultTechParam || {});
      setIsloading(false);
      return;
    }
    setIsloading(false);
    //TODO: handle error
  };

  useEffect(() => {
    if (queryParams.id) {
      getSingleProcess();
    }
  }, [queryParams?.id]);

  const onUpdateData = async (id, val) => {
    if (!id) return;
    setIsTechParams(true);
    const resData: any = await updateTechParams(val);
    const { status, data, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Ürün güncelleme başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      setTechParams(data);
      setIsTechParams(false);
      return;
    }
  };

  const onAddRow = async (val) => {
    if (!process?.machineId) {
      const { status, data } = await getMachines();
      if (status === 200) {
        setMachines(data);
        setIsShowMachinePopUp(true);
        return;
      }
    }

    setIsTechParams(true);
    const resData: any = await addTechParams({
      ...val,
      processId: queryParams.id,
      machineId: process.machineId,
    });

    const { status, data, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Parametre ekleme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      setTechParams(data);
      setIsTechParams(false);
      return;
    }
  };
  const onRemoveRow = async (val) => {
    const resData: any = await deleteTechParams(val);
    const { status, data, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Parametre silme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      setTechParams(data);
      return;
    }
  };

  const onFinish = async () => {
    const { id, faultId } = process;
    if (!id || !faultId) return;

    setIsSubmitting(true);
    const resData: any = await updateProcess({
      id,
      faultId,
      status: 'FINISHED',
      updatedBy: session?.user?.name,
    });
    const { status, response } = resData;
    if (response?.error) {
      const { message, detail } = response?.error;
      toast.error('Proses güncelleme işlemi başarısız.' + message);
      log(detail);
      setIsSubmitting(false);
      return;
    }

    if (status === 200) {
      await getSingleProcess();
      setIsShowPopUp(false);
      router.push(`/admin/process/${process.id}`);
    }
  };

  const onAddMachine = async () => {
    if (!values?.machineId) return;
    setIsSubmitting(true);
    const { status } = await updateProcess({
      id: process.id,
      faultId: process.faultId,
      ...values,
      createdBy: session?.user?.name,
    });
    if (status === 200) {
      await getSingleProcess();
      toast.success('Makine ekleme işlemi başarılı.');
      setIsShowMachinePopUp(false);
      setIsSubmitting(false);
      return;
    }
    toast.error('Bir hata oluştu, tekrar deneyin !');
    return;
  };

  const handleValues = (event) => {
    setValues(JSON.parse(event.target?.value));
  };

  const handleOnFinish = () => {
    if (process?.frequency === 'Yazılsın' && techParams.length === 0) {
      setIsFrequencyPopUp(true);
      return;
    }

    setIsShowPopUp(true);
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
              {Object.entries(process).map(([key, value], idx) => {
                if (productInfo.includes(key)) {
                  return (
                    <div className="" key={idx}>
                      <h2 className="font-bold capitalize italic">
                        {infoTranslate[key]}
                      </h2>
                      <> {value}</>
                    </div>
                  );
                }
              })}
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
                fields={machineParams}
                techParams={techParams}
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
