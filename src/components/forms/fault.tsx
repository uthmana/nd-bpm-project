'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';
import Upload from 'components/upload';
import {
  log,
  applications,
  standards,
  colors,
  convertToISO8601,
  removeMillisecondsAndUTC,
} from 'utils';
import { FaultObj } from '../../app/localTypes/table-types';
import { getStocks } from '../../app/lib/apiRequest';

export default function Fault(props: {
  onSubmit: (e: any) => void;
  editData?: FaultObj;
  title: string;
  loading: boolean;
}) {
  const { onSubmit, editData, title, loading } = props;
  const initialValues = editData
    ? editData
    : {
        customerName: '',
        arrivalDate: '',
        product: '',
        quantity: 1,
        productCode: '',
        productBatchNumber: '',
        application: 'ND Strip',
        standard: 'DIN 267-27',
        color: 'Mavi',
        technicalDrawingAttachment: '',
        faultDescription: '',
        customerId: '',
      };

  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(
    initialValues.technicalDrawingAttachment
      ? initialValues.technicalDrawingAttachment
      : '',
  );

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  const handleValues = (event) => {
    setError(false);
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  useEffect(() => {
    const getStock = async () => {
      const { status, data } = await getStocks();
      if (status === 200) {
        setCustomers(data);
      }
    };
    getStock();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { customerName, productCode, quantity, application } = values;
    if (!customerName || !productCode || !quantity || !application) {
      window.scroll(0, 0);
      setError(true);
      return;
    }
    onSubmit({
      ...values,
      quantity: parseInt(values.quantity.toString()),
      technicalDrawingAttachment: file,
      arrivalDate: convertToISO8601(values.arrivalDate),
    });
  };

  const onCustomerSelect = (event) => {
    if (!event.target?.value) return;
    const stock = JSON.parse(event.target?.value);
    const { product_code, product_name, inventory, date, customer } = stock;
    setValues({
      ...values,
      customerName: customer?.company_name,
      customerId: customer?.id,
      product: product_name,
      productCode: product_code,
      quantity: inventory,
      arrivalDate: removeMillisecondsAndUTC(date),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-[20px]">
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
        <h1 className="dark:white mb-8 text-center text-2xl font-bold md:text-4xl">
          {title}
        </h1>
      ) : null}

      {error ? (
        <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
          Lütfen boş <b> ürün adi</b>, <b> ürün kodu</b>, <b>fiyatı</b> ve para
          birimi alanları doldurmanız lazım !
        </p>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Select
          required={true}
          extra="pt-1"
          label="Müşteri Adı"
          onChange={onCustomerSelect}
        >
          {customers.map((item, idx) => {
            return (
              <option
                key={idx}
                value={JSON.stringify(item)}
                selected={values.customerName === item.customer?.company_name}
              >
                {item.customer?.company_name || item.customer?.rep_name}
              </option>
            );
          })}
        </Select>

        {/* <InputField
          label="Müşteri Adı"
          onChange={handleValues}
          type="text"
          id="customerName"
          name="customerName"
          placeholder="Müşteri Adı"
          extra="mb-2"
          value={values.customerName}
          required={true}
        /> */}

        <InputField
          label="Ürün İsmi"
          onChange={handleValues}
          type="text"
          id="product"
          name="product"
          placeholder="Ürün İsmi"
          extra="mb-2"
          value={values.product}
          required={true}
        />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <InputField
          label="Ürün kodu"
          onChange={handleValues}
          type="text"
          id="productCode"
          name="productCode"
          placeholder="Ürün kodu"
          extra="mb-2"
          value={values.productCode}
          required={true}
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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        {/* <InputField
          label="Baç No."
          onChange={handleValues}
          type="text"
          id="productBatchNumber"
          name="productBatchNumber"
          placeholder="Baç No."
          extra="mb-2"
          min={1}
          value={values.productBatchNumber}
        /> */}

        {/* <InputField
          label="İrsalye Tarihi"
          onChange={handleValues}
          type="datetime-local"
          id="invoiceDate"
          name="invoiceDate"
          placeholder="İrsalye Tarihi"
          extra="mb-2"
          value={values.invoiceDate}
        /> */}
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Select
          required={true}
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
                selected={editData ? editData?.application === item : idx === 0}
              >
                {item}
              </option>
            );
          })}
        </Select>

        <Select
          required={true}
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
                selected={editData ? editData?.standard === item : idx === 0}
              >
                {item}
              </option>
            );
          })}
        </Select>

        <Select
          required={true}
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
                selected={editData ? editData?.color === item : idx === 0}
              >
                {item}
              </option>
            );
          })}
        </Select>
      </div>

      <div className="my-8">
        <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
          İlgili Doküman
        </label>
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
