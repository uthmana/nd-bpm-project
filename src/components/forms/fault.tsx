'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import TextArea from 'components/fields/textArea';
import Upload from 'components/upload';
import { log, convertToISO8601, removeMillisecondsAndUTC } from 'utils';
import { FaultObj } from '../../app/localTypes/table-types';
import { getCustomers, getFaultSettings } from '../../app/lib/apiRequest';
import DataList from 'components/fields/dataList';

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
        application: '',
        standard: '',
        color: '',
        technicalDrawingAttachment: '',
        faultDescription: '',
        customerId: '',
        product_name: '',
      };

  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(
    initialValues.technicalDrawingAttachment
      ? initialValues.technicalDrawingAttachment
      : '',
  );

  type SettingItem = {
    id: string;
    name: string;
  };

  type Settings = {
    applications: Array<SettingItem>;
    standards: Array<SettingItem>;
    colors: Array<SettingItem>;
  };

  const [customers, setCustomers] = useState([]);
  const [faultSettings, setFaultSettings] = useState({} as Settings);

  const handleValues = (event) => {
    setError(false);
    if (event.target?.name === 'company_name') {
      const _customer = customers.filter(
        (item) => item.company_name === event.target?.value,
      )[0];
      const seletecCustomer = {
        customerName: _customer?.company_name,
        customerId: _customer?.id,
      };
      setValues({ ...values, ...seletecCustomer });
      return;
    }
    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  useEffect(() => {
    const getStock = async () => {
      const { status, data } = await getCustomers();
      if (status === 200) {
        setCustomers(data);
      }
    };

    const getAllFaultSettings = async () => {
      const { status: faultSettingsStatus, data: faultSettingsData } =
        await getFaultSettings();
      if (faultSettingsStatus === 200) {
        setFaultSettings(faultSettingsData);
        if (!editData) {
          setValues({
            ...values,
            application: faultSettingsData.applications[0].name,
            standard: faultSettingsData.standards[0].name,
            color: faultSettingsData.colors[0].name,
          });
        }
      }
    };

    getAllFaultSettings();
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

    delete values.product_name;
    console.log({
      ...values,
      quantity: parseInt(values.quantity.toString()),
      technicalDrawingAttachment: file,
      arrivalDate: convertToISO8601(values.arrivalDate),
    });

    onSubmit({
      ...values,
      quantity: parseInt(values.quantity.toString()),
      technicalDrawingAttachment: file,
      arrivalDate: convertToISO8601(values.arrivalDate),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
          Lütfen kırmızı ile işaretlenmiş alanları doldurmanız gerekiyor!
        </p>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        {/* <Select
          required={true}
          extra="pt-1"
          label="Müşteri Adı"
          name="company_name"
          onChange={handleValues}
        >
          {customers?.map((item, idx) => {
            return (
              <option
                key={idx}
                value={JSON.stringify(item)}
                selected={values.customerName === item?.company_name}
              >
                {item?.company_name || item?.rep_name}
              </option>
            );
          })}
        </Select> */}

        <DataList
          placeholder="Müşteri Adı"
          label="Müşteri Adı"
          id="company_name"
          name="company_name"
          listId="company_name_list"
          list={customers}
          required={true}
          value={values.customerName}
          onChange={handleValues}
        />

        <InputField
          label="Ürün Adı"
          onChange={handleValues}
          type="text"
          id="product"
          name="product"
          placeholder="Ürün Adı"
          extra="mb-2"
          value={values.product}
          required={true}
        />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <InputField
          label="Ürün kodu (Müşteri)"
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
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Select
          required={true}
          extra="pt-1"
          label="Uygulama"
          onChange={handleValues}
          name="application"
        >
          {faultSettings?.applications?.map((item, idx) => {
            return (
              <option
                value={item.name}
                key={idx}
                selected={
                  editData ? editData?.application === item.name : idx === 0
                }
              >
                {item.name}
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
          {faultSettings?.standards?.map((item, idx) => {
            return (
              <option
                value={item.name}
                key={idx}
                selected={
                  editData ? editData?.standard === item.name : idx === 0
                }
              >
                {item.name}
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
          {faultSettings?.colors?.map((item, idx) => {
            return (
              <option
                value={item.name}
                key={idx}
                selected={editData ? editData?.color === item.name : idx === 0}
              >
                {item.name}
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
