import { Fault } from 'app/localTypes/types';
import Button from 'components/button';
import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

interface AccordionItem {
  id: string;
  company_name: string;
  Fault: Array<Fault>;
}

interface AccordionProps {
  items: AccordionItem[];
  onSubmit?: (val: any) => void;
}

const Accordion: React.FC<AccordionProps> = ({ items, onSubmit }) => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="mx-auto w-full space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-lg border  shadow-sm dark:border-gray-900"
        >
          <button
            className="flex w-full items-center justify-between bg-gray-100 p-3 hover:bg-gray-200 dark:bg-[#111c44] dark:text-white"
            onClick={() => toggleAccordion(index)}
          >
            <span className="font-semibold">{item.company_name}</span>
            {openIndex === index ? (
              <MdKeyboardArrowUp size={20} />
            ) : (
              <MdKeyboardArrowDown size={20} />
            )}
          </button>
          {openIndex === index && (
            <div className="border-t bg-white p-3 dark:border-gray-900 dark:bg-[#111c44] dark:text-white ">
              <div className="mb-4">
                <div className="grid w-full grid-cols-6 gap-1 border-b font-bold dark:border-gray-900">
                  <div>#</div>
                  <div>Ürün</div>
                  <div>Uygulama</div>
                  <div>Standart</div>
                  <div>Renk</div>
                  <div>Miktar</div>
                </div>

                {item.Fault?.map((faultItem, idx) => (
                  <div key={faultItem.id} className="grid w-full grid-cols-1">
                    <label className="flex items-center" key={faultItem.id}>
                      <div className="grid w-full grid-cols-6 items-center gap-1 border-b py-2 text-sm font-bold text-navy-700 dark:border-gray-900 dark:text-white">
                        <div>{idx + 1}</div>
                        <div>{faultItem?.product}</div>
                        <div>{faultItem?.application}</div>
                        <div>{faultItem?.standard}</div>
                        <div>{faultItem?.color}</div>
                        <div>
                          {faultItem?.shipmentQty || faultItem?.quantity}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => onSubmit(item)}
                extra="mt-4 max-w-fit px-4 h-[40px] mb-4"
                text="İRSALİYE TAMAMLA"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
