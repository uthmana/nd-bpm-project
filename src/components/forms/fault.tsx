'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';
import { log } from 'utils';
import Upload from 'components/upload';

type FaultObj = {
  customerName: string;
  traceabilityCode: string;
  arrivalDate: string;
  invoiceDate: string;
  product: string;
  quantity: number;
  productCode: string;
  productBatchNumber: string;
  application: string;
  standard: string;
  color: string;
  faultDescription: string;
  status: string;
  technicalDrawingAttachment: string;
  controlInfo: string;
};

export default function Fault(props: {
  onSubmit: (e: any) => void;
  data?: FaultObj;
  title: string;
  loading: boolean;
}) {
  const { onSubmit, data, title, loading } = props;
  const applications = [
    'ND Patch',
    'ND Strip',
    'ST-3 Thread Sealant',
    'LM-1293 Maskeleme',
    'Vibra-Tite VC-3',
    'ND Microspheres 593 S',
    'ND Microspheres TA 850',
    'ND Microspheres TA 800',
    'ND Microspheres TA 300',
    'ND Microspheres 1193 S',
    'EZ-Drive 300 Lubricating',
    'EZ-Drive 200 Lubricating',
  ];
  const standards = [
    'DIN 267-27',
    'DIN 267-28',
    'Müşteri isteği',
    'WA 970',
    'WSS-M21P27-A4',
    'IFI-124',
    'IFI-125',
    'IFI-524',
    'IFI-525',
    'MS-CC76',
    'PF-6616',
    'WX 200',
    'Diğer',
  ];
  const colors = [
    'Mavi',
    'Turuncu',
    'Turkuaz',
    'Pembe',
    'Kırmızı',
    'Yeşil',
    'Sarı',
    'Beyaz',
    'Siyah',
  ];

  const initialValues = data
    ? data
    : {
        customerName: '',
        traceabilityCode: '',
        arrivalDate: '',
        invoiceDate: '',
        product: '',
        quantity: 1,
        productCode: '',
        productBatchNumber: '',
        application: 'ND Patch',
        standard: 'DIN 267-27',
        color: 'Mavi',
        technicalDrawingAttachment: '',
        faultDescription: '',
        controlInfo: '',
      };

  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(
    initialValues.technicalDrawingAttachment
      ? initialValues.technicalDrawingAttachment
      : '',
  );

  const handleValues = (event) => {
    setError(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { traceabilityCode } = values;
    if (!traceabilityCode) {
      setError(true);
    }
    onSubmit({
      ...values,
      quantity: parseInt(values.quantity.toString()),
      technicalDrawingAttachment: file,
      arrivalDate: values.arrivalDate + (!data ? ':00.123Z' : ''),
      invoiceDate: values.invoiceDate + (!data ? ':00.123Z' : ''),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[780px] rounded-[20px] bg-white p-5 dark:bg-opacity-10"
    >
      <NextLink
        href="/admin/entry"
        className="flex items-center gap-2 text-sm dark:text-white"
      >
        <span>
          <MdOutlineArrowBack />
        </span>
        Ürün Girişi
      </NextLink>

      {title ? (
        <h1 className="my-5 text-center text-[24px] font-bold dark:text-white">
          {title}
        </h1>
      ) : null}

      {error ? (
        <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
          Lütfen boş <b> ürün adi</b>, <b> ürün kodu</b>, <b>fiyatı</b> ve para
          birimi alanları doldurmanız lazım !
        </p>
      ) : null}

      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <InputField
          label="Müşteri Adı"
          onChange={handleValues}
          type="text"
          id="customerName"
          name="customerName"
          placeholder="Müşteri Adı"
          extra="mb-2"
          value={values.customerName}
        />
        <InputField
          label="Takıp kodu"
          onChange={handleValues}
          type="text"
          id="traceabilityCode"
          name="traceabilityCode"
          placeholder="Takıp kodu"
          extra="mb-2"
          value={values.traceabilityCode}
        />

        <InputField
          label="Varış tarihi"
          onChange={handleValues}
          type="datetime-local"
          id="arrivalDate"
          name="arrivalDate"
          placeholder="varış tarihi"
          extra="mb-2"
          value={values.arrivalDate}
        />
      </div>

      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <InputField
          label="Ürün İsmi"
          onChange={handleValues}
          type="text"
          id="product"
          name="product"
          placeholder="Ürün İsmi"
          extra="mb-2"
          value={values.product}
        />
        <InputField
          label="Miktar"
          onChange={handleValues}
          type="number"
          id="quantity"
          name="quantity"
          placeholder="Miktar"
          extra="mb-2"
          value={values.quantity}
        />

        <InputField
          label="İrsalye Tarihi"
          onChange={handleValues}
          type="datetime-local"
          id="invoiceDate"
          name="invoiceDate"
          placeholder="İrsalye Tarihi"
          extra="mb-2"
          value={values.invoiceDate}
        />
      </div>

      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <InputField
          label="Ürün kodu"
          onChange={handleValues}
          type="text"
          id="productCode"
          name="productCode"
          placeholder="Ürün kodu"
          extra="mb-2"
          value={values.productCode}
        />

        <InputField
          label="Baç No."
          onChange={handleValues}
          type="text"
          id="productBatchNumber"
          name="productBatchNumber"
          placeholder="Baç No."
          extra="mb-2"
          min={1}
          value={values.productBatchNumber}
        />

        <InputField
          label="Baç No."
          onChange={handleValues}
          type="text"
          id="controlInfo"
          name="controlInfo"
          placeholder="Kontrol Info."
          extra="mb-2"
          min={1}
          value={values.controlInfo}
        />
      </div>

      <div className="mb-3 flex flex-col gap-3 sm:flex-row">
        <Select
          extra="pt-1"
          label="Uygulama"
          onChange={handleValues}
          name="application"
        >
          {applications.map((item, idx) => {
            return (
              <option
                value={item}
                key={idx}
                selected={data ? data?.application === item : idx === 0}
              >
                {item}
              </option>
            );
          })}
        </Select>

        <Select
          extra="pt-1"
          label="Standart"
          onChange={handleValues}
          name="standard"
        >
          {standards.map((item, idx) => {
            return (
              <option
                value={item}
                key={idx}
                selected={data ? data?.standard === item : idx === 0}
              >
                {item}
              </option>
            );
          })}
        </Select>
      </div>

      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <Select
          extra="pt-1"
          label="Renk Seçimi"
          onChange={handleValues}
          name="color"
        >
          {colors.map((item, idx) => {
            return (
              <option
                value={item}
                key={idx}
                selected={data ? data?.color === item : idx === 0}
              >
                {item}
              </option>
            );
          })}
        </Select>
      </div>

      <div className="my-3">
        <Upload
          onChange={(val) => setFile(val)}
          fileType="all"
          multiple={false}
          _fileName={
            initialValues.technicalDrawingAttachment
              ? initialValues.technicalDrawingAttachment
              : ''
          }
          _filePath={
            initialValues.technicalDrawingAttachment
              ? '/uploads/' + initialValues.technicalDrawingAttachment
              : ''
          }
        />
      </div>

      <div>
        <TextArea
          label="Açıklama"
          onChange={handleValues}
          id="faultDescription"
          name="faultDescription"
          placeholder="Açıklama"
          extra="mb-8"
          value={values.faultDescription}
        />
      </div>

      <Button loading={loading} extra="mt-4" text="SAVE" />
    </form>
  );
}
