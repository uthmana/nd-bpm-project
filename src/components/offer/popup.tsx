import Popup from 'components/popup';
import React, { useEffect, useState } from 'react';
import Button from 'components/button/button';
import InputField from 'components/fields/InputField';
import Select from 'components/select/page';
import Upload from 'components/upload';
import TextArea from 'components/fields/textArea';
import { getFaultSettings } from 'app/lib/apiRequest';
import { FormSkeleton } from 'components/skeleton';

export default function OfferPopup({ isShowPopUp, onClose, onAdd, extra }) {
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState([]);
  const [standard, setStandard] = useState([]);

  const [offer, setOffer] = useState({
    name: '',
    application: '',
    standard: '',
    quantity: '',
    price: '',
    unitPrice: '',
    // discountPrice: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, status } = await getFaultSettings();
      if (status === 200) {
        const { applications, standards } = data;
        setApplication(applications);
        setStandard(standards);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const onAddProduct = () => {
    const {
      name,
      application,
      standard,
      quantity,
      price,
      unitPrice,
      // discountPrice,
    } = offer;
    if (
      !name ||
      !application ||
      !standard ||
      !quantity ||
      !price ||
      !unitPrice
      // !discountPrice
    ) {
      return;
    }

    onAdd({
      ...offer,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      unitPrice: parseFloat(unitPrice),
      // discountPrice: parseFloat(discountPrice),
      image: file,
    });

    setOffer({
      name: '',
      application: offer.application,
      standard: offer.standard,
      quantity: '',
      price: '',
      unitPrice: '',
      // discountPrice: '',
      description: '',
      image: '',
    });
  };

  const handleProductValues = (event) => {
    let newVal: any = { [event.target?.name]: event.target?.value };
    if (
      (event.target?.name === 'quantity', event.target?.name === 'unitPrice')
    ) {
      /*
      const price =
        parseInt(newVal?.unitPrice || offer.unitPrice) *
        parseInt(newVal.quantity || offer.quantity);
       */

      const price =
        (newVal?.unitPrice || offer.unitPrice) *
        (newVal.quantity || offer.quantity);
      newVal = { ...newVal, price: price };
    }

    console.log(offer);
    console.log(newVal);
    setOffer({ ...offer, ...newVal });
  };

  return (
    <Popup
      show={isShowPopUp}
      extra={`flex dark:bg-navy-700 flex-col gap-3 py-6 px-8 ${extra}`}
    >
      {loading ? (
        <FormSkeleton />
      ) : (
        <>
          <div className="min-h-[1px] w-full rounded-lg">
            <h2 className="my-5 text-center text-lg font-bold dark:text-white">
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
                <option value=" " selected disabled></option>
                {application.map((item, idx) => {
                  return (
                    <option value={item.name} key={idx}>
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
                <option value=" " selected disabled></option>
                {standard.map((item, idx) => {
                  return (
                    <option value={item.name} key={idx}>
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

              {/* <InputField
                label="İndirimli Fiyat"
                onChange={handleProductValues}
                type="number"
                id="discountPrice"
                name="discountPrice"
                placeholder=""
                extra="!h-[36px]"
                value={offer.discountPrice}
              /> */}
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
              />
            </div>
            {/* <Button onClick={addProduct} extra="mt-7 h-[36px]" text="EKLE" /> */}
          </div>

          <div className="flex gap-4">
            <Button
              text="EKLE"
              extra="w-[60px]  h-[40px]"
              onClick={onAddProduct}
            />
            <Button
              text="GERİ"
              extra="w-[60px] h-[40px] bg-red-700"
              onClick={() => onClose(false)}
            />
          </div>
        </>
      )}
    </Popup>
  );
}
