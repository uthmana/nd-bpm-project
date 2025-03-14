'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  addProcess,
  getFaultByIdWithFilter,
  getMachines,
} from 'app/lib/apiRequest';
import { DetailSkeleton } from 'components/skeleton';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import {
  formatDateTime,
  faultInfo,
  infoTranslate,
  formatCurrency,
  techParameters,
  formatTechParams,
} from 'utils';
import Button from 'components/button';
import { MdAdd, MdGroupWork, MdPrint } from 'react-icons/md';
import FileViewer from 'components/fileViewer';
import DetailHeader from 'components/detailHeader';
import Barcode from 'react-jsbarcode';
import Unaccept from 'components/forms/unaccept';
import Popup from 'components/popup';
import Select from 'components/select';
import TechParamsTable from 'components/admin/data-tables/techParamsTable';
import FinalControl from 'components/forms/finalControl';
import EntryControlForm from 'components/forms/faultControl';
import { getResError } from 'utils/responseError';
import { toast } from 'react-toastify';

export default function Edit() {
  const router = useRouter();
  const queryParams = useParams();
  const { data: session } = useSession();
  const [fault, setFault] = useState([] as any);
  const [faultControl, setFaultControl] = useState({} as any);
  const [defaultTechParameter, setDefaultTechParameter] = useState([] as any);
  const [process, setProcess] = useState({} as any);
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({} as any);
  const [isShowMachinePopUp, setIsShowMachinePopUp] = useState(false);
  const [machines, setMachines] = useState([]);
  const [isPrecessSubmitting, setIsPrecessSubmitting] = useState(false);
  const [finalControl, setFinalControl] = useState([] as any);
  const [finalControlFormData, setFinalControlFormData] = useState({} as any);

  const detailData = {
    title: 'Ürün Detayi',
    seeAllLink: '/admin/entry',
    seeAllText: 'Tüm Ürünler',
    actionLink: `/admin/liste`,
    actionText: 'LİSTE',
  };

  useEffect(() => {
    const getSingleFault = async () => {
      try {
        setIsLoading(true);
        const { data } = await getFaultByIdWithFilter({
          id: queryParams.id,
          filters: {
            faultControl: true,
            unacceptable: true,
            finalControl: {
              include: {
                testItem: true,
                testArea: true,
              },
            },
            defaultTechParameter: true,
            customer: true,
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
          },
        });

        setFault({
          customerName: data?.customer?.company_name,
          ...data,
          quantity: formatCurrency(data?.quantity, 'int'),
        });
        setProcess(data?.process?.[0]);
        setFaultControl(data?.faultControl?.[0]);
        setFinalControl(data?.finalControl);
        setDefaultTechParameter(
          formatTechParams(techParameters, data?.defaultTechParameter?.[0]),
        );
        setFinalControlFormData({
          fault: data,
          finalControl: data?.finalControl?.[0] || {},
          machineName: data?.process?.[0]?.machine?.[0]?.machine_Name || '',
        });
        setIsLoading(false);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsLoading(false);
      }
    };
    if (queryParams.id) {
      getSingleFault();
    }
  }, [queryParams?.id]);

  const renderProductInfo = (key, val) => {
    if (key === 'arrivalDate') {
      return <p className="font-bold"> {formatDateTime(val)} </p>;
    }
    if (key === 'technicalDrawingAttachment') {
      return <FileViewer file={val} />;
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

  const handleProcessStart = async () => {
    try {
      const { data } = await getMachines();
      setMachines(data);
      setIsShowMachinePopUp(true);
      return;
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsShowMachinePopUp(false);
    }
  };

  const onAddMachine = async () => {
    const frequency = faultControl?.frequencyDimension;
    const { machineName, machineId } = values;
    const val = {
      frequency,
      machineName,
      machineId,
      faultId: queryParams.id,
      createdBy: session?.user?.name,
    };
    setIsPrecessSubmitting(true);
    try {
      const { data } = await addProcess(val);
      router.push(`/admin/process/create/${data.id}`);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsShowMachinePopUp(false);
      setIsPrecessSubmitting(false);
    }
  };

  const handleMachineSelect = (event) => {
    setValues(JSON.parse(event.target?.value));
  };

  //hanle router
  const handlefaultControl = () => {
    router.push(`/admin/entry/control/${queryParams?.id}`);
  };
  const handleProcessUpdate = async () => {
    router.push(`/admin/process/create/${process.id}`);
  };
  const handleProcessControl = () => {
    router.push(`/admin/process/control/${fault.id}`);
  };
  const handleUnacceptableEdit = (id: string, stage: string) => {
    if (stage === 'FINAL') {
      router.push(`/admin/process/control/${id}`);
      return;
    }
    router.push(`/admin/entry/control/${id}`);
  };

  //Handle Prints
  const handleBarcodePrint = () => {
    const product_barcode =
      document.getElementById('product_barcode').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(
      '<div style="page-break-before: always;"></div>',
    );
    printWindow.document.write(
      '<div style="page-break-before: always;"></div>',
    );
    printWindow.document.write(
      '<div style="page-break-before: always;"></div>',
    );
    printWindow.document.write(product_barcode);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };
  const handleProcessPrint = () => {
    console.log('Process printing.....');
  };
  const handleFinalControlPrint = () => {
    console.log('Final printing.....');
  };
  const handleEntryUnacceptablePrint = (stage) => {
    console.log('EntryFault printing.....');
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <DetailSkeleton />
      ) : (
        <div className="w-full">
          <DetailHeader {...detailData} />

          <div className="mx-auto mb-4 grid max-w-5xl grid-cols-1 gap-4">
            <Card extra="mx-auto  w-full rounded-2xl px-8 pt-10 bg-white dark:bg-[#111c44] dark:text-white">
              <div className="mb-4 flex w-full justify-between">
                <h2 className="mb-4 text-2xl font-bold">Ürün Bilgileri</h2>
                <Button
                  extra={`px-4 h-[40px] max-w-fit`}
                  onClick={handleBarcodePrint}
                  text="BARKODU YAZDIR"
                  icon={<MdPrint className="mr-1 h-5 w-5" />}
                />
              </div>
              <div className="mb-10 grid w-full grid-cols-2 gap-2  md:grid-cols-3 lg:grid-cols-4">
                {fault && fault.id
                  ? Object.entries(fault).map(([key, val]: any, index) => {
                      if (faultInfo.includes(key)) {
                        return (
                          <div
                            key={index}
                            className="mb-5 flex flex-col flex-nowrap"
                          >
                            <h4 className="mx-1 italic">
                              {infoTranslate[key]}
                            </h4>
                            {renderProductInfo(key, val)}
                          </div>
                        );
                      }
                    })
                  : null}
              </div>
            </Card>

            <Card extra="mx-auto w-full rounded-2xl px-8 pt-10 bg-white dark:bg-[#111c44] dark:text-white">
              <h2 className="mb-4 text-2xl font-bold">
                Varsayılan Teknik Parametreleri
              </h2>

              {defaultTechParameter?.length > 0 ? (
                <div className="mb-12 grid grid-cols-3 gap-2">
                  {defaultTechParameter.map((item, idx) => {
                    if (!item.value) {
                      return null;
                    }
                    return (
                      <div key={idx}>
                        <p className="mb-0 text-sm font-bold italic">
                          {item.display_name}
                        </p>
                        <p className="min-h-6 bg-gray-100 px-1">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </Card>

            <Card extra="mx-auto w-full rounded-2xl px-8 pt-10 bg-white dark:bg-[#111c44] dark:text-white">
              <div className="mb-8 flex justify-between gap-3">
                <h2 className="text-2xl font-bold">
                  Ürün Giriş Kontrol Bilgileri
                </h2>
                <div className="flex gap-2">
                  {(fault?.status != 'SEVKIYAT_TAMAMLANDI' &&
                    session?.user?.role === 'SUPER') ||
                  session?.user?.role === 'ADMIN' ? (
                    <Button
                      icon={<MdAdd className="mr-1 h-5 w-5" />}
                      extra="max-w-fit px-4  h-[40px]"
                      text={faultControl?.id ? 'DÜZENLE' : 'KONTROL YAP'}
                      onClick={handlefaultControl}
                    />
                  ) : null}
                  <Button
                    extra={`px-4 h-[40px] max-w-fit`}
                    onClick={handleProcessPrint}
                    text=" "
                    icon={<MdPrint className="mr-1 h-5 w-5" />}
                  />
                </div>
              </div>
              {faultControl?.id ? (
                <EntryControlForm
                  variant="data"
                  title={'Ürün Girişi Kontrol Formu'}
                  info={fault}
                  data={faultControl}
                />
              ) : (
                <div className="flex h-32 w-full items-center justify-center opacity-75">
                  Henüz Ürün Kontrolü yapılmadı
                </div>
              )}
            </Card>

            <Card extra="mx-auto pb-8 w-full rounded-2xl px-8 pt-10 bg-white dark:bg-[#111c44] dark:text-white">
              <div className="mb-4 flex w-full justify-between">
                <h2 className="mb-4 text-2xl font-bold">
                  Proses Frekans Bilgileri
                </h2>

                <div className="flex gap-2">
                  {fault?.status != 'GIRIS_KONTROL_RET' ? (
                    <Button
                      extra={`px-4 h-[40px] max-w-fit`}
                      onClick={
                        process?.id ? handleProcessUpdate : handleProcessStart
                      }
                      text={process?.id ? 'PROSESE GİT' : 'PROSES BAŞLAT'}
                      icon={<MdGroupWork className="mr-1 h-5 w-5" />}
                      disabled={
                        !faultControl?.result ||
                        faultControl.result === 'REJECT'
                      }
                    />
                  ) : null}
                  <Button
                    extra={`px-4 h-[40px] max-w-fit`}
                    onClick={handleProcessPrint}
                    text=" "
                    icon={<MdPrint className="mr-1 h-5 w-5" />}
                  />
                </div>
              </div>
              {process?.id ? (
                <TechParamsTable
                  fields={process?.machine[0]?.machineParams?.map(
                    (item) => item.param_name,
                  )}
                  techParams={process?.technicalParams}
                  defaultTechParams={''}
                  status={'FINISHED'}
                />
              ) : null}
            </Card>

            {fault?.unacceptable?.length > 0 ? (
              <div className="w-full">
                {fault?.unacceptable.map((item) => (
                  <Card extra="mb-10" key={item?.id}>
                    <div className="mb-2 flex justify-between gap-3 bg-white px-7 py-5">
                      <h2 className="text-2xl font-bold">
                        Uygunsuz Ürün/Hizmet Formu
                      </h2>
                      <div className="flex gap-2">
                        {fault?.status != 'SEVKIYAT_TAMAMLANDI' ? (
                          <Button
                            extra={`px-4 h-[40px] !max-w-fit`}
                            onClick={() =>
                              handleUnacceptableEdit(
                                fault.id,
                                item.unacceptableStage,
                              )
                            }
                            text="DÜZENLE"
                            icon={<MdAdd className="mr-1 h-5 w-5" />}
                          />
                        ) : null}

                        <Button
                          extra={`px-4 h-[40px] max-w-fit`}
                          onClick={() =>
                            handleEntryUnacceptablePrint(item.unacceptableStage)
                          }
                          text=" "
                          icon={<MdPrint className="mr-1 h-5 w-5" />}
                        />
                      </div>
                    </div>
                    <div className="page-break relative min-h-[800px] w-full bg-white px-7 py-5 print:absolute  print:top-0 print:z-[99999] print:min-h-screen print:w-full print:pl-0 print:pr-8">
                      <Unaccept formData={item} fault={fault} variant="value" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}

            <Card extra="mt-2 w-full rounded-2xl bg-white px-8 py-10 dark:bg-[#111c44] dark:text-white">
              <div className="my-2 mb-5 flex justify-between">
                <h2 className="text-2xl font-bold">Final Kontrol Bilgileri</h2>
                <div className="flex gap-2">
                  {fault?.status != 'SEVKIYAT_TAMAMLANDI' &&
                  process?.status === 'FINISHED' &&
                  (session?.user?.role === 'SUPER' ||
                    session?.user?.role === 'ADMIN') ? (
                    <Button
                      icon={<MdAdd className="mr-1 h-5 w-5" />}
                      extra="max-w-fit px-4  h-[40px]"
                      text={`${
                        finalControl?.length > 0 ? 'DÜZENLE' : 'KONTROL YAP'
                      } `}
                      onClick={handleProcessControl}
                    />
                  ) : null}

                  <Button
                    extra={`px-4 h-[40px] max-w-fit`}
                    onClick={handleFinalControlPrint}
                    text=" "
                    icon={<MdPrint className="mr-1 h-5 w-5" />}
                  />
                </div>
              </div>

              {finalControl?.length === 0 ? (
                <div className="flex h-32 w-full items-center justify-center opacity-40">
                  Henüz final kontrolü yapılmadı
                </div>
              ) : (
                <FinalControl data={finalControlFormData} variant="data" />
              )}
            </Card>
          </div>
        </div>
      )}
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
            onChange={handleMachineSelect}
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
            loading={isPrecessSubmitting}
            text="DEVAM"
            extra="w-[60px] h-[40px]"
            onClick={onAddMachine}
          />
        </div>
      </Popup>
    </div>
  );
}
