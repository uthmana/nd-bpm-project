'use client';

import React, { useState } from 'react';
import { convertToISO8601, generateSKU, currencySymbol } from 'utils';
import TextArea from 'components/fields/textArea';
import Button from 'components/button/button';
import Select from 'components/select/page';
import { MdAdd } from 'react-icons/md';
import InputField from 'components/fields/InputField';
import DataList from 'components/fields/dataList';
import { addOfferItem, deleteOfferItem } from 'app/lib/apiRequest';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import SignaturePad from 'components/signaturePad';
import Image from 'next/image';

const OfferPopup = dynamic(() => import('components/offer/popup'), {
  ssr: false,
});

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
  const [resetFile, setResetFile] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const { data: session } = useSession();

  const currentDateTime = new Date();
  const localDateTime = new Date(
    currentDateTime.getTime() - currentDateTime.getTimezoneOffset() * 60000,
  )
    .toISOString()
    ?.slice(0, 16);

  const currency = ['TL', 'USD', 'EUR'];
  const [values, setValues] = useState(
    isUpdate
      ? editData
      : {
          barcode: '',
          startDate: localDateTime,
          endDate: localDateTime,
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
      onChange({ ...values, ...seletecCustomer, key: Date.now() });

      return;
    }

    const newVal = { [event.target?.name]: event.target?.value };
    setValues({ ...values, ...newVal });
    debounce(
      onChange({ ...values, ...newVal, product: products, key: Date.now() }),
    );
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
          console.log('delete Offer Item beklenmeyen bir hata oluştu.!');
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
    debounce(
      onChange({
        ...values,
        totalAmount: totalPrice,
        product: newProd,
        key: Date.now(),
      }),
    );
  };

  const onAddProduct = async (val) => {
    let updatedOfferItem = val;
    if (isUpdate) {
      const { status, data } = await addOfferItem({
        ...val,
        offerId: editData?.id,
        createdBy: session?.user?.name,
        currency: values.currency,
      });
      if (status === 200) {
        updatedOfferItem = data;
      }
    }

    const newVal = [...products];
    newVal.push({ ...updatedOfferItem });
    setResetFile(true);

    setProducts(newVal);
    const totalPrice = newVal.reduce(
      (a, b) => parseInt(a) + parseInt(b.price),
      0,
    );
    setValues({ ...values, totalAmount: totalPrice });
    debounce(
      onChange({
        ...values,
        totalAmount: totalPrice,
        product: newVal,
        key: Date.now(),
        ...(values.company_name && totalPrice
          ? { barcode: generateSKU('TEK', values.company_name, totalPrice) }
          : {}),
      }),
    );

    setShowAddProduct(false);
  };

  const handleSignaturePad = (val) => {
    setValues({ ...values, product: products, creatorTitle: val });
    debounce(
      onChange({
        ...values,
        creatorTitle: val,
        product: products,
        key: Date.now(),
      }),
    );
  };

  const debounce = (value) => {
    if (!value) return;
    setTimeout(() => {
      value();
    }, 1000);
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
          <h1 className="mb-4 text-center text-2xl font-bold">
            Teklif Oluşturma
          </h1>
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
              // required={true}
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

          <div className="mb-12 min-w-full border-b border-t pl-2">
            <h3 className="mb-4 mt-8 text-center text-xl">Teklif Ürünleri</h3>
            <div className="mb-6 grid w-full grid-cols-1 dark:text-white ">
              <div className="grid w-full grid-cols-11 gap-1 border-b text-sm font-bold">
                <div className="col-span-1"></div>
                <div className="col-span-2">Ürün</div>
                <div className="col-span-2">Uygulama</div>
                <div className="col-span-2">Standart</div>
                <div className="col-span-1">Miktar</div>
                <div className="col-span-2">Birim Fiyat</div>
                <div className="col-span-1 whitespace-nowrap break-keep">
                  Tutar
                </div>
              </div>
              {products?.length > 0 ? (
                products.map((item, idx) => {
                  return (
                    <label className="flex items-center " key={idx}>
                      <div className="group grid w-full grid-cols-11 items-start gap-2 border-b py-1 text-sm font-bold text-navy-700 dark:text-white">
                        <div className="col-span-1 flex gap-2 py-1">
                          <div
                            className="flex h-[24px] w-[24px] items-center justify-center rounded-full border p-2 hover:bg-red-400 hover:text-white"
                            onClick={(e) => removeProduct(e, idx)}
                          >
                            X
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="grid grid-cols-5">
                            {item?.image ? (
                              <span className="col-span-1">
                                <Image
                                  width="90"
                                  height="60"
                                  src={`${item.image}`}
                                  alt={'Product'}
                                  className="w-full"
                                />
                              </span>
                            ) : null}

                            <div className="col-span-2">
                              <div>{item?.name}</div>
                              <div className="text-xs font-normal">
                                {item?.description}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2">{item?.application}</div>
                        <div className="col-span-2">{item?.standard}</div>
                        <div className="col-span-1">{item?.quantity}</div>
                        <div className="col-span-2  ">
                          <div className="flex gap-1 ">
                            <span>{item?.unitPrice}</span>
                            <span> {currencySymbol[values.currency]}</span>
                          </div>
                          {/* <div className="flex gap-1">
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
                          </div> */}
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

              <div className="flex w-full justify-between">
                <div className="mb-4  mt-5 max-w-[200px]">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAddProduct(!showAddProduct);
                    }}
                    extra="mt-7 h-[36px] px-4"
                    text="ÜRÜN EKLE"
                    icon={<MdAdd className="ml-1 h-6 w-6" />}
                  />
                </div>
                <div className="mb-4  mt-5 max-w-[200px]">
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
              </div>
            </div>
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

          <div className="mb-4 flex max-w-[330px] flex-col">
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

            <SignaturePad
              label="İmza"
              value={values.creatorTitle}
              onSave={(sign: string) => handleSignaturePad(sign)}
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

      <OfferPopup
        extra="!top-[50%] !w-[90%] !max-w-[700px]"
        isShowPopUp={showAddProduct}
        onAdd={(val) => onAddProduct(val)}
        onClose={() => setShowAddProduct(false)}
      />
    </div>
  );
}
