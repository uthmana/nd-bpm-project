import Popup from 'components/popup';
import React, { useEffect, useState } from 'react';
import Button from 'components/button';
import InputField from 'components/fields/InputField';
import Select from 'components/select';
import Upload from 'components/upload';
import TextArea from 'components/fields/textArea';
import { getFaultSettings } from 'app/lib/apiRequest';
import { FormSkeleton } from 'components/skeleton';
import { formatCurrency, deformatCurrency } from 'utils';

export default function OfferPopup({ isShowPopUp, onClose, onAdd, extra }) {
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [standardOptions, setStandardOptions] = useState([]);

  const [offer, setOffer] = useState({
    name: '',
    application: '',
    standard: '',
    quantity: '',
    unitPrice: '',
    price: '',
    description: '',
    image: '',
  });

  // Fetch fault settings on component mount
  useEffect(() => {
    const fetchFaultSettings = async () => {
      setLoading(true);
      const { data, status } = await getFaultSettings();
      if (status === 200) {
        const { applications, standards } = data;
        setApplicationOptions(applications);
        setStandardOptions(standards);
      }
      setLoading(false);
    };

    fetchFaultSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update offer state with formatted values
    setOffer((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Use the new values directly from the input fields for calculation
    let newQuantity = name === 'quantity' ? value : offer.quantity;
    let newUnitPrice = name === 'unitPrice' ? value : offer.unitPrice;

    // Calculate price (Tutar)
    const newPrice =
      deformatCurrency(newQuantity, 'int') *
      deformatCurrency(newUnitPrice, 'float');

    // Set the formatted price in state
    setOffer((prev) => ({
      ...prev,
      price: formatCurrency(newPrice.toString()),
    }));
  };

  // Handle adding the offer
  const handleAddProduct = () => {
    const { name, application, standard, quantity, price, unitPrice } = offer;

    // Validate form fields
    if (
      !name ||
      !application ||
      !standard ||
      !quantity ||
      !price ||
      !unitPrice
    ) {
      return;
    }

    onAdd({
      ...offer,
      quantity,
      price,
      unitPrice,
    });

    // Reset form after submission
    setOffer({
      ...offer,
      name: '',
      quantity: '',
      price: '',
      unitPrice: '',
      description: '',
      image: '',
    });
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                name="application"
              >
                <option value=" " selected disabled></option>
                {applicationOptions.map((item, idx) => {
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
                onChange={handleInputChange}
                name="standard"
              >
                <option value=" " selected disabled></option>
                {standardOptions.map((item, idx) => {
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
                onChange={handleInputChange}
                type="quantity"
                id="quantity"
                format="qty"
                name="quantity"
                placeholder=""
                extra="!h-[36px]"
                value={offer.quantity}
              />

              <InputField
                label="Birim Fiyat"
                onChange={handleInputChange}
                type="currency"
                format="tr"
                id="unitPrice"
                name="unitPrice"
                placeholder=""
                extra="!h-[36px]"
                value={offer.unitPrice}
              />
            </div>
            <div className="ml-auto w-full max-w-[208px]">
              <InputField
                label="Tutar"
                onChange={handleInputChange}
                type="text"
                id="price"
                name="price"
                placeholder=""
                extra="!h-[36px]"
                value={offer.price}
                disabled
              />
            </div>
            <div className="col-span-3 w-full">
              <TextArea
                label="Açıklama"
                onChange={handleInputChange}
                id="description"
                name="description"
                placeholder="Açıklama"
                extra="mb-4 w-full"
                value={offer.description}
              />
            </div>
            <div className="my-8 w-full">
              <Upload
                label="İlgili Doküman"
                id="image"
                name="image"
                onChange={handleInputChange}
                value={offer.image}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              text="EKLE"
              extra="w-[60px]  h-[40px]"
              onClick={handleAddProduct}
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
