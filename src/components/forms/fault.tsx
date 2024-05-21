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
  convertToISO8601,
  removeMillisecondsAndUTC,
  generateSKU,
  techParameters,
  formatTechParams,
  resetDafaultParams,
} from 'utils';
import { FaultObj } from '../../app/localTypes/table-types';
import {
  getCustomers,
  getCustomersWithStock,
  getFaultSettings,
} from '../../app/lib/apiRequest';
import DataList from 'components/fields/dataList';
import { toast } from 'react-toastify';

type SettingItem = {
  id: string;
  name: string;
};

type Settings = {
  applications: Array<SettingItem>;
  standards: Array<SettingItem>;
  colors: Array<SettingItem>;
};

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
  const [customers, setCustomers] = useState([]);
  const [faultSettings, setFaultSettings] = useState({} as Settings);
  const [stockProduct, setStockProduct] = useState([]);
  const [newProduct, setNewProduct] = useState(null);
  const [file, setFile] = useState(
    initialValues.technicalDrawingAttachment
      ? initialValues.technicalDrawingAttachment
      : '',
  );

  const formatedTechParams = formatTechParams(
    techParameters,
    editData?.defaultTechParameter && editData?.defaultTechParameter[0],
  );
  const [techParams, setTechParams] = useState(formatedTechParams);

  useEffect(() => {
    const fetchData = async () => {
      const [settingsResponse, customerResponse]: any = await Promise.all([
        getFaultSettings(),
        getCustomersWithStock(),
      ]);
      const { status: setStatus, data: setData } = settingsResponse;
      const { status: custStatus, data: custData } = customerResponse;
      if (setStatus === 200 && custStatus === 200) {
        setCustomers(custData);
        setFaultSettings(setData);
        if (!editData) {
          // const currentDateTime = new Date().toISOString().slice(0, 16);
          const currentDateTime = new Date();
            const localDateTime = new Date(currentDateTime.getTime() - currentDateTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setValues({
            ...values,
            application: setData.applications[0].name,
            standard: setData.standards[0].name,
            color: setData.colors[0].name,
            arrivalDate: localDateTime,
          });
        }
        return;
      }
      toast.error('Beklenmeyen bir hata oluştu!. Daha sonra tekrar deneyiniz!');
    };
    fetchData();
  }, []);

  const handleValues = (event) => {
    setError(false);
    // Handle Company chanrge
    if (
      event.target?.name === 'product' &&
      event.target?.value === 'NEW_ENTRY'
    ) {
      setValues({ ...values, product: '' });
      setNewProduct(event.target?.value);
      setStockProduct([]);
      return;
    }

    if (event.target?.name === 'company_name') {
      const _customer = customers.filter(
        (item) => item.company_name === event.target?.value,
      )[0];
      let selectedCustomer = {
        customerName: _customer?.company_name,
        customerId: _customer?.id,
        product: '',
      };

      if (_customer?.Stock?.length > 0) {
        setStockProduct(_customer?.Stock);
        const {
          product_name,
          product_code,
          inventory,
          date,
          productBatchNumber,
        } = _customer?.Stock[0];
        const stockData = {
          product: product_name,
          productBatchNumber: productBatchNumber,
          productCode: product_code,
          quantity: inventory,
          arrivalDate: removeMillisecondsAndUTC(date),
        };
        selectedCustomer = { ...selectedCustomer, ...stockData };
      } else {
        setStockProduct([]);
      }

      setValues({ ...values, ...selectedCustomer });
      return;
    }
    // Handle Product change
    if (event.target?.name === 'product' && stockProduct.length > 0) {
      const _stockData = stockProduct.find(
        (item) => item.id === event.target?.value,
      );
      const {
        product_name,
        product_code,
        date,
        inventory,
        productBatchNumber,
      } = _stockData;
      const stockData = {
        product: product_name,
        productBatchNumber: productBatchNumber,
        productCode: product_code,
        quantity: inventory,
        arrivalDate: removeMillisecondsAndUTC(date),
      };
      setValues({ ...values, ...stockData });
      return;
    }

    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { customerName, productCode, quantity, application, product } =
      values;
    if (
      !customerName ||
      !productCode ||
      !quantity ||
      !application ||
      !product
    ) {
      window.scroll(0, 0);
      setError(true);
      return;
    }

    //handle defaultTechParameter
    let defaultTechParameter = resetDafaultParams([...techParams]);
    defaultTechParameter =
      JSON.stringify(defaultTechParameter) !== '{}'
        ? { ...defaultTechParameter, machineId: 'defaultparams_' + Date.now() }
        : { Ort_Uretim_saat: null, machineId: 'defaultparams_' + Date.now() };
    if (editData?.defaultTechParameter && editData?.defaultTechParameter[0]) {
      defaultTechParameter = {
        ...defaultTechParameter,
        id: editData?.defaultTechParameter[0].id,
      };
    }

    const product_barcode = generateSKU(customerName, product, quantity);
    delete values.product_name;

    onSubmit({
      ...values,
      defaultTechParameter,
      product_barcode,
      quantity: parseInt(values.quantity.toString()),
      technicalDrawingAttachment: file,
      arrivalDate: convertToISO8601(values.arrivalDate),
    });
  };

  const handleTechValues = (event) => {
    const temp = [...techParams];
    const value = temp.map((item) => {
      if (item.param_name === event.target?.name) {
        return { ...item, value: event.target?.value };
      }
      return item;
    });
    setTechParams(value);
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

        {stockProduct.length > 0 && newProduct === null ? (
          <Select
            required={true}
            extra="pt-1"
            label="Ürün Adı"
            name="product"
            onChange={handleValues}
          >
            {stockProduct?.map((item, idx) => {
              return (
                <>
                  <option value={item.id} key={idx} selected={idx === 0}>
                    {item.product_name}
                  </option>
                  <option value={'NEW_ENTRY'}>---Yeni Ürün Ekle</option>
                </>
              );
            })}
          </Select>
        ) : (
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
        )}

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
          label="Parti No."
          onChange={handleValues}
          type="text"
          id="productBatchNumber"
          name="productBatchNumber"
          placeholder="Parti No."
          extra="mb-2"
          value={values.productBatchNumber}
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

      <div className="flex flex-col gap-3 rounded-md bg-gray-50 p-4 !text-sm dark:bg-gray-50/10">
        <h2 className="mb-3 font-bold">Teknikal Params </h2>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {techParams.map((item, idx) => {
            return (
              <InputField
                key={idx}
                label={item.display_name}
                onChange={handleTechValues}
                type="text"
                id={item.param_name}
                name={item.param_name}
                placeholder=""
                extra="mb-2"
                disabled={item.param_name === 'Ort_Uretim_saat'}
                value={item.value}
              />
            );
          })}
        </div>
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
          // _filePath={
          //   initialValues.technicalDrawingAttachment
          //     ? '/uploads/' + initialValues.technicalDrawingAttachment
          //     : ''
          // }
          _filePath={
            initialValues.technicalDrawingAttachment
              ? initialValues.technicalDrawingAttachment
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

      <Button loading={loading} extra="mt-4" text="KAYDET" />
    </form>
  );
}
