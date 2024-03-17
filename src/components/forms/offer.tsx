'use client';

import React, { useEffect, useState } from 'react';
import {
  formatDateTime,
  removeMillisecondsAndUTC,
  convertToISO8601,
  generateSKU,
  currencySymbol,
} from 'utils';
import TextArea from 'components/fields/textArea';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdOutlineArrowBack } from 'react-icons/md';
import NextLink from 'next/link';
import InputField from 'components/fields/InputField';
import DataList from 'components/fields/dataList';
import {
  addOfferItem,
  deleteOfferItem,
  getFaultSettings,
} from 'app/lib/apiRequest';
import { useSession } from 'next-auth/react';
import Card from 'components/card';
import Upload from 'components/upload';

export default function OfferForm(props: {
  onSubmit: (e: any, d: any) => void;
  editData?: any;
  title?: string;
  info?: any;
  isSubmitting?: boolean;
  onChange?: (e: any) => void;
}) {
  const { info, editData, onSubmit, isSubmitting, onChange } = props;
  const isUpdate = editData && editData?.id ? true : false;
  const [error, setError] = useState(false);
  const [formTouch, setFormTouch] = useState(isUpdate);
  const [customers, setCustomers] = useState(info || []);
  const [products, setProducts] = useState(isUpdate ? editData?.product : []);
  const [application, setApplication] = useState([]);
  const [standard, setStandard] = useState([]);
  const [file, setFile] = useState('');
  const [resetFile, setResetFile] = useState(false);

  const { data: session } = useSession();
  const currency = ['TL', 'USD', 'EUR'];
  const [values, setValues] = useState(
    isUpdate
      ? editData
      : {
          barcode: '',
          startDate: '',
          endDate: '',
          totalAmount: 0,
          currency: 'TL',
          description: '',
          phoneNumber: '',
          email: '',
          creatorTitle: '',
          customerId: '',
          createdBy: '',
          rep_name: '',
          address: '',
          companyName: '',
          company_name: '',
        },
  );

  const [offer, setOffer] = useState({
    name: '',
    application: '',
    standard: '',
    quantity: '',
    price: '',
    unitPrice: '',
    discountPrice: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, status } = await getFaultSettings();
      if (status === 200) {
        const { applications, standards } = data;
        setApplication(applications);
        setStandard(standards);
      }
    };

    fetchData();
  }, []);

  const handleValues = (event) => {
    setError(false);
    setFormTouch(false);

    if (event.target?.name === 'companyName') {
      const _customer = customers.filter(
        (item) => item.company_name === event.target?.value,
      )[0];

      const seletecCustomer = {
        company_name: _customer?.company_name,
        customerId: _customer?.id,
        email: _customer?.email_offer,
        phoneNumber: _customer?.phoneNumber_shipment,
        rep_name: _customer?.rep_name,
        address: _customer?.address,
        companyName: _customer?.company_name,
      };

      setValues({ ...values, ...seletecCustomer });
      onChange({ ...values, product: products });

      return;
    }

    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
    onChange({ ...values, ...newVal, product: products });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { startDate, endDate, customerId, email } = values;
    if (
      !startDate ||
      !endDate ||
      !customerId ||
      !email ||
      products?.length === 0
    ) {
      setError(true);
      window.scroll(100, 0);
      return;
    }

    let isEdit = isUpdate;
    if (editData && editData?.Customer?.company_name !== values.company_name) {
      isEdit = false;
    }
    onSubmit(
      {
        ...values,
        totalAmount: parseFloat(values.totalAmount),
        startDate: convertToISO8601(values.startDate),
        endDate: convertToISO8601(values.endDate),
        product: products,
        barcode: generateSKU('TEK', values.company_name, values.totalAmount),
      },
      isEdit,
    );
  };

  const handleProductValues = (event) => {
    setError(false);
    let newVal: any = { [event.target?.name]: event.target?.value };

    if (
      event.target?.name === 'quantity' ||
      event.target?.name === 'discountPrice'
    ) {
      const price =
        parseInt(newVal?.discountPrice || offer.discountPrice) *
        parseInt(newVal.quantity || offer.quantity);
      newVal = { ...newVal, price: price };
    }

    setOffer({ ...offer, ...newVal });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const { name, application, standard, quantity, price } = offer;
    if (!name || !application || !standard || !quantity || !price) {
      return;
    }

    let updatedOfferItem = offer;
    if (isUpdate) {
      const { status, data } = await addOfferItem({
        ...offer,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        offerId: editData?.id,
        createdBy: session?.user?.name,
        currency: values.currency,
      });
      if (status === 200) {
        updatedOfferItem = data;
      }
    }

    const newVal = [...products];
    newVal.push({
      ...updatedOfferItem,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      image: file,
    });
    setResetFile(true);

    setProducts(newVal);
    const totalPrice = newVal.reduce(
      (a, b) => parseInt(a) + parseInt(b.price),
      0,
    );
    setValues({ ...values, totalAmount: totalPrice });
    onChange({ ...values, totalAmount: totalPrice, product: newVal });
    setOffer({
      name: '',
      application: offer.application,
      standard: offer.standard,
      quantity: '',
      price: '',
      unitPrice: '',
      discountPrice: '',
      description: '',
      image: '',
    });
  };

  const removeProduct = async (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    const newProd = [...products].filter((item, index) => index !== idx);

    if (isUpdate) {
      const filteredProd = [...products].filter(
        (item, index) => index === idx,
      )[0];
      if (filteredProd && filteredProd?.id) {
        const { status, data } = await deleteOfferItem(filteredProd?.id);
        if (status !== 200) {
          console.log('deleteOfferItem beklenmeyen bir hata oluştu.!');
        }
      } else {
        return;
      }
    }

    setProducts(newProd);
    const totalPrice = newProd.reduce(
      (a, b) => parseInt(a) + parseInt(b.price),
      0,
    );
    setValues({ ...values, totalAmount: totalPrice });
    onChange({ ...values, totalAmount: totalPrice, product: newProd });
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {error ? (
          <p className="mb-3 w-full rounded-md bg-red-500 p-2 text-center text-sm  font-bold text-white">
            Lütfen zorunlu alanları boş bırakılmamalı.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <InputField
              label="Başlangıç Tarihi"
              onChange={handleValues}
              type="datetime-local"
              id="startDate"
              name="startDate"
              placeholder="01.01.2024"
              extra="mb-2"
              value={values.startDate}
              required={true}
            />

            <InputField
              label="Bitiş Tarihi"
              onChange={handleValues}
              type="datetime-local"
              id="endDate"
              name="endDate"
              placeholder="01.01.2024"
              extra="mb-2"
              value={values.endDate}
              required={true}
            />
          </div>

          <div className="w-full">
            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <DataList
                placeholder="Şirket adı"
                label="Müşteri Seç"
                id="companyName"
                name="companyName"
                listId="companyName_list"
                list={customers}
                value={values.companyName}
                onChange={handleValues}
              />

              <Select
                extra="pt-1"
                label="Para Birimi"
                onChange={handleValues}
                name="currency"
              >
                {currency.map((item, idx) => {
                  return (
                    <option
                      value={item}
                      key={idx}
                      selected={values.currency === item || idx == 0}
                    >
                      {item}
                    </option>
                  );
                })}
              </Select>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <InputField
              label="Şirket Adı"
              onChange={handleValues}
              type="text"
              id="company_name"
              name="company_name"
              placeholder="company ltd."
              extra="mb-2"
              value={values.company_name}
              required={true}
            />
            <InputField
              label="Sorumlu"
              onChange={handleValues}
              type="text"
              id="rep_name"
              name="rep_name"
              placeholder="Sorumlu"
              extra="mb-2"
              value={values.rep_name}
              required={true}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <InputField
              label="Telefon (Teklif)"
              onChange={handleValues}
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="0212 222 2222"
              extra="mb-2"
              value={values.phoneNumber}
            />
            <InputField
              label="E-posta (Teklif)"
              onChange={handleValues}
              type="text"
              id="email"
              name="email"
              placeholder="example@mail.com"
              extra="mb-2"
              value={values.email}
              required={true}
            />
          </div>

          <div className="mb-4 flex flex-col flex-wrap gap-3 lg:flex-row">
            <div className="w-full">
              <TextArea
                label="Adres"
                onChange={handleValues}
                id="address"
                name="address"
                placeholder="Adres"
                extra="mb-8 w-full"
                value={values.address}
                required={true}
              />
            </div>
          </div>

          <div className="mb-12 min-w-full pl-2">
            <div className="mb-6 grid w-full grid-cols-1">
              <div className="grid w-full grid-cols-11 gap-1 border-b text-sm font-bold">
                <div className="col-span-1"></div>
                <div className="col-span-6">Ürün</div>
                <div className="col-span-1">Miktar</div>
                <div className="col-span-2">Birim Fiyat</div>
                <div className="col-span-1 whitespace-nowrap break-keep">
                  Tutar
                </div>
              </div>

              {products?.length > 0 ? (
                products.map((item, idx) => {
                  return (
                    <label className="flex items-center" key={idx}>
                      <div className="group grid w-full grid-cols-11 items-start gap-2 border-b py-1 text-sm font-bold text-navy-700 dark:text-white">
                        <div className="col-span-1 flex gap-2 py-1">
                          <div
                            className="flex h-[24px] w-[24px] items-center justify-center rounded-full border p-2 hover:bg-red-400 hover:text-white"
                            onClick={(e) => removeProduct(e, idx)}
                          >
                            X
                          </div>
                        </div>
                        <div className="col-span-6">
                          <div className="grid grid-cols-5">
                            {item?.image ? (
                              <span className="col-span-1">
                                <img
                                  className="w-full"
                                  src={`/uploads/${item.image}`}
                                  alt={item?.name}
                                />
                              </span>
                            ) : null}

                            <div className="col-span-4">
                              <div className="col-span-4 px-1">
                                <div>{item?.name}</div>
                                <div className="mb-1">
                                  {item?.application} - {item?.standard}
                                </div>
                                <div className="text-xs font-normal">
                                  {item?.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-1">{item?.quantity}</div>
                        <div className="col-span-2 flex flex-col text-[10px]">
                          <div className="flex gap-1">
                            <span className="line-through">
                              {item?.unitPrice}
                            </span>
                            <span> {currencySymbol[values.currency]}</span>
                          </div>
                          <div className="flex gap-1">
                            <span>{item?.discountPrice}</span>
                            <span> {currencySymbol[values.currency]}</span>
                          </div>

                          <div className="flex gap-1">
                            <span>
                              {' '}
                              {'('}%{' '}
                              {Math.round(
                                ((item?.unitPrice - item?.discountPrice) /
                                  item?.unitPrice) *
                                  100,
                              )}{' '}
                              indi.
                              {')'}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-1">
                          {item?.price} {currencySymbol[values.currency]}
                        </div>
                      </div>
                    </label>
                  );
                })
              ) : (
                <div className="flex min-h-[60px] items-center justify-center opacity-40">
                  Henüz İş Açıklaması Eklenmedi.
                </div>
              )}

              <div className="mb-4 ml-auto mt-5 max-w-[200px]">
                <InputField
                  label={`Toplam ${currencySymbol[values.currency]}`}
                  onChange={handleValues}
                  type="text"
                  id="totalAmount"
                  name="totalAmount"
                  placeholder=""
                  extra="mb-2"
                  value={values.totalAmount}
                />
              </div>

              <div className="mt-10 min-h-[1px] w-full rounded-lg bg-lightPrimary px-3 py-4">
                <h2 className="my-5 text-center text-lg font-bold">
                  Teklif Ürünü Ekle
                </h2>
                <div className="mb-3 flex flex-col gap-3 sm:flex-row">
                  <InputField
                    label="Ürün"
                    onChange={handleProductValues}
                    type="text"
                    id="name"
                    name="name"
                    placeholder=""
                    extra="!h-[36px]"
                    value={offer.name}
                  />

                  <Select
                    extra="pt-1"
                    label="Uygulama"
                    onChange={handleProductValues}
                    name="application"
                  >
                    {application.map((item, idx) => {
                      return (
                        <option
                          value={item.name}
                          key={idx}
                          selected={idx === 0}
                        >
                          {item.name}
                        </option>
                      );
                    })}
                  </Select>

                  <Select
                    extra="pt-1"
                    label="standart"
                    onChange={handleProductValues}
                    name="standard"
                  >
                    {standard.map((item, idx) => {
                      return (
                        <option
                          value={item.name}
                          key={idx}
                          selected={idx === 0}
                        >
                          {item.name}
                        </option>
                      );
                    })}
                  </Select>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <InputField
                    label="Miktar"
                    onChange={handleProductValues}
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder=""
                    extra="!h-[36px]"
                    value={offer.quantity}
                  />

                  <InputField
                    label="Birim Fiyat"
                    onChange={handleProductValues}
                    type="number"
                    id="unitPrice"
                    name="unitPrice"
                    placeholder=""
                    extra="!h-[36px]"
                    value={offer.unitPrice}
                  />

                  <InputField
                    label="İndirimli Fiyat"
                    onChange={handleProductValues}
                    type="number"
                    id="discountPrice"
                    name="discountPrice"
                    placeholder=""
                    extra="!h-[36px]"
                    value={offer.discountPrice}
                  />
                </div>
                <div className="ml-auto w-full max-w-[208px]">
                  <InputField
                    label="Tutar"
                    onChange={handleProductValues}
                    type="number"
                    id="price"
                    name="price"
                    placeholder=""
                    extra="!h-[36px]"
                    value={offer.price}
                  />
                </div>
                <div className="col-span-3 w-full">
                  <TextArea
                    label="Açıklama"
                    onChange={handleProductValues}
                    id="description"
                    name="description"
                    placeholder="Açıklama"
                    extra="mb-4 w-full"
                    value={offer.description}
                  />
                </div>
                <div className="my-8 w-full">
                  <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                    İlgili Doküman
                  </label>
                  <Upload
                    onChange={(val) => setFile(val)}
                    fileType="all"
                    multiple={false}
                    key={products?.length}
                  />
                </div>
                <Button
                  onClick={addProduct}
                  extra="mt-7 h-[36px]"
                  text="EKLE"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            <InputField
              label="Teklif Hazırlayan"
              onChange={handleValues}
              type="text"
              id="text"
              name="createdBy"
              placeholder=""
              extra="mb-2"
              value={values.createdBy}
              required={true}
            />
            <InputField
              label="Teklif Hazırlayan Unvanı"
              onChange={handleValues}
              type="text"
              id="creatorTitle"
              name="creatorTitle"
              placeholder=""
              extra="mb-2"
              value={values.creatorTitle}
              required={true}
            />
          </div>

          <div className="w-full">
            <TextArea
              label="Açıklama"
              onChange={handleValues}
              id="description"
              name="description"
              placeholder="Açıklama"
              extra="mb-8 w-full"
              value={values.description}
            />
          </div>

          <Button
            disabled={formTouch}
            loading={isSubmitting}
            extra="mt-4"
            text="KAYDET ve GÖNDER"
          />
        </form>
      </div>
      {/* <div className="mt-8 flex justify-between text-sm font-bold opacity-40">
        <div>
          <p>Oluşturan: {editData?.createdBy}</p>
          <p>
            Oluşturulma Tarihi:{' '}
            {editData?.createdAt ? formatDateTime(editData?.createdAt) : ''}
          </p>
        </div>
        <div>
          <p>Güncelleyen: {editData?.updatedBy}</p>
          <p>
            Güncelleme Tarihi:{' '}
            {editData?.updatedAt ? formatDateTime(editData?.updatedAt) : ''}
          </p>
        </div>
      </div> */}
    </div>
  );
}
