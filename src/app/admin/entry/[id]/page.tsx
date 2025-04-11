'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFaultByIdWithFilter } from 'app/lib/apiRequest';
import { DetailSkeleton } from 'components/skeleton';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import { formatCurrency, techParameters, formatTechParams } from 'utils';
import Button from 'components/button';
import { MdAdd, MdGroupWork, MdPrint } from 'react-icons/md';
import DetailHeader from 'components/detailHeader';
import Unaccept from 'components/forms/unaccept';
import TechParamsTable from 'components/admin/data-tables/techParamsTable';
import FinalControl from 'components/forms/finalControl';
import EntryControlForm from 'components/forms/faultControl';
import { getResError } from 'utils/responseError';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import FaultInfo from 'components/faultInfo';
import { exportToExcel } from 'utils/exportToExcel';

export default function Edit() {
  const router = useRouter();
  const queryParams = useParams();
  const { data: session } = useSession();
  const [fault, setFault] = useState([] as any);
  const [faultControl, setFaultControl] = useState({} as any);
  const [defaultTechParameter, setDefaultTechParameter] = useState([] as any);
  const [process, setProcess] = useState({} as any);
  const [isLoading, setIsLoading] = useState(false);
  const [finalControl, setFinalControl] = useState([] as any);
  const [finalControlFormData, setFinalControlFormData] = useState({} as any);

  const [entryUnacceptable, setEntryUnacceptable] = useState({} as any);
  const [finalUnacceptable, setFinalUnacceptable] = useState({} as any);

  const entryControlRef = useRef<HTMLDivElement>(null);
  const frequencyTableRef = useRef<HTMLDivElement>(null);
  const entryunacceptedRef = useRef<HTMLDivElement>(null);
  const finalunacceptedRef = useRef<HTMLDivElement>(null);
  const finalControlRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);

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
        setEntryUnacceptable(
          data?.unacceptable?.find(
            (item) => item.unacceptableStage === 'ENTRY',
          ),
        );
        setFinalUnacceptable(
          data?.unacceptable?.find(
            (item) => item.unacceptableStage === 'FINAL',
          ),
        );

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

  //hanle router
  const handlefaultControl = () => {
    router.push(`/admin/entry/control/${queryParams?.id}`);
  };
  const handleProcessStart = async () => {
    router.push(`/admin/process/create/${fault.id}?newprocess=true`);
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
  const entryControlPrint = useReactToPrint({ contentRef: entryControlRef });
  const entryUnacceptedPrint = useReactToPrint({
    contentRef: entryunacceptedRef,
    documentTitle: 'ND INDUSTRIES TÜRKİYE PROSES',
  });
  const finalunacceptedPrint = useReactToPrint({
    contentRef: finalunacceptedRef,
    documentTitle: 'ND INDUSTRIES TÜRKİYE PROSES',
  });
  const finalControlPrint = useReactToPrint({
    contentRef: finalControlRef,
    documentTitle: 'ND INDUSTRIES TÜRKİYE PROSES',
  });
  const barcodePrint = useReactToPrint({
    contentRef: barcodeRef,
    documentTitle: 'ND INDUSTRIES TÜRKİYE PROSES',
  });
  const frequencyTableExport = (fields, technicalParams) => {
    const tableData = technicalParams.map((item) => {
      let newItem = {};
      Object.entries(item)
        .map(([key, value]) => {
          if (fields.includes(key)) {
            newItem = { ...newItem, [key]: value };
          }
        })
        ?.filter(Boolean);
      return newItem;
    });
    exportToExcel(tableData, `${process?.id}.xlsx`);
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
              <div className="mb-4 flex w-full justify-between print:hidden">
                <h2 className="mb-4 text-2xl font-bold">Ürün Bilgileri</h2>
                <div className="flex gap-3">
                  <Button
                    extra={`px-4 h-[40px] max-w-fit`}
                    onClick={() => barcodePrint()}
                    text="BARKODU YAZDIR"
                    icon={<MdPrint className="mr-1 h-5 w-5" />}
                  />
                </div>
              </div>
              <FaultInfo fault={fault} barcodeRef={barcodeRef} />
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
                        <p className="min-h-6 rounded-sm bg-gray-100 p-1">
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </Card>

            <Card
              ref={entryControlRef}
              extra="mx-auto w-full rounded-2xl px-8 pt-10 print:p-0 bg-white dark:bg-[#111c44] dark:text-white"
            >
              <div className="mb-8 flex justify-between gap-3 print:hidden">
                <h2 className="text-2xl font-bold">
                  Ürün Giriş Kontrol Bilgileri
                </h2>
                <div className="flex gap-2">
                  {fault?.status != 'SEVKIYAT_TAMAMLANDI' &&
                  (session?.user?.role === 'SUPER' ||
                    session?.user?.role === 'ADMIN') ? (
                    <Button
                      icon={<MdAdd className="mr-1 h-5 w-5" />}
                      extra="max-w-fit px-4  h-[40px]"
                      text={faultControl?.id ? 'DÜZENLE' : 'KONTROL YAP'}
                      onClick={handlefaultControl}
                    />
                  ) : null}
                  {faultControl?.id ? (
                    <Button
                      extra={`px-4 h-[40px] max-w-fit`}
                      onClick={() => entryControlPrint()}
                      text=" "
                      icon={<MdPrint className="mr-1 h-5 w-5" />}
                    />
                  ) : null}
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

            {entryUnacceptable?.id ? (
              <Card
                ref={entryunacceptedRef}
                className="w-full"
                extra="mb-10 dark:bg-[#111c44] dark:text-white"
              >
                <div className="flex justify-between gap-3 bg-white px-7 py-5 dark:bg-[#111c44] dark:text-white print:hidden">
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
                            entryUnacceptable.unacceptableStage,
                          )
                        }
                        text="DÜZENLE"
                        icon={<MdAdd className="mr-1 h-5 w-5" />}
                      />
                    ) : null}

                    <Button
                      extra={`px-4 h-[40px] max-w-fit`}
                      onClick={() => entryUnacceptedPrint()}
                      text=" "
                      icon={<MdPrint className="mr-1 h-5 w-5" />}
                    />
                  </div>
                </div>
                <div className="page-break relative min-h-[800px] w-full bg-white px-7 py-5 dark:bg-[#111c44] dark:text-white">
                  <Unaccept
                    formData={entryUnacceptable}
                    fault={fault}
                    variant="value"
                  />
                </div>
              </Card>
            ) : null}

            <Card
              ref={frequencyTableRef}
              extra="mx-auto pb-8 w-full rounded-2xl px-8 pt-10 bg-white dark:bg-[#111c44] dark:text-white"
            >
              <div className="mb-4 flex w-full justify-between print:hidden">
                <h2 className="mb-4 text-2xl font-bold">
                  Proses Frekans Bilgileri
                </h2>

                <div className="flex gap-2">
                  {fault?.status != 'SEVKIYAT_TAMAMLANDI' &&
                  fault?.status != 'GIRIS_KONTROL_RET' &&
                  session?.user?.role != 'NORMAL' ? (
                    <Button
                      extra={`px-4 h-[40px] max-w-fit`}
                      onClick={
                        process?.id ? handleProcessUpdate : handleProcessStart
                      }
                      text={'PROSESE GİT'}
                      icon={<MdGroupWork className="mr-1 h-5 w-5" />}
                      disabled={
                        !faultControl?.result ||
                        faultControl.result === 'REJECT'
                      }
                    />
                  ) : null}

                  {process?.id && process?.technicalParams?.length ? (
                    <Button
                      extra={`px-4 h-[40px] max-w-fit`}
                      onClick={() =>
                        frequencyTableExport(
                          process?.machine[0]?.machineParams?.map(
                            (item) => item.param_name,
                          ),
                          process?.technicalParams,
                        )
                      }
                      text=" "
                      icon={<MdPrint className="mr-1 h-5 w-5" />}
                    />
                  ) : null}
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

            <Card
              ref={finalControlRef}
              extra="mt-2 w-full rounded-2xl bg-white px-8 py-10 dark:bg-[#111c44] dark:text-white"
            >
              <div className="my-2 mb-5 flex justify-between print:hidden">
                <h2 className="text-2xl font-bold">Final Kontrol Bilgileri</h2>
                <div className="flex gap-2">
                  {fault?.status != 'SEVKIYAT_TAMAMLANDI' &&
                  process?.status === 'FINISHED' &&
                  (session?.user?.role == 'SUPER' ||
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

                  {finalControl?.length ? (
                    <Button
                      extra={`px-4 h-[40px] max-w-fit`}
                      onClick={() => finalControlPrint()}
                      text=" "
                      icon={<MdPrint className="mr-1 h-5 w-5" />}
                    />
                  ) : null}
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

            {finalUnacceptable?.id ? (
              <Card
                ref={finalunacceptedRef}
                className="w-full"
                extra="mb-10 dark:bg-[#111c44] dark:text-white"
              >
                <div className="flex justify-between gap-3 bg-white px-7 py-5 dark:bg-[#111c44] dark:text-white print:hidden">
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
                            finalUnacceptable.unacceptableStage,
                          )
                        }
                        text="DÜZENLE"
                        icon={<MdAdd className="mr-1 h-5 w-5" />}
                      />
                    ) : null}

                    <Button
                      extra={`px-4 h-[40px] max-w-fit`}
                      onClick={() => finalunacceptedPrint()}
                      text=" "
                      icon={<MdPrint className="mr-1 h-5 w-5" />}
                    />
                  </div>
                </div>
                <div className="page-break relative min-h-[800px] w-full bg-white px-7 py-5 dark:bg-[#111c44] dark:text-white">
                  <Unaccept
                    formData={finalUnacceptable}
                    fault={fault}
                    variant="value"
                  />
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
