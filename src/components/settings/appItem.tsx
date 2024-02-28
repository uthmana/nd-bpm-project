'use client';

import Button from 'components/button/button';
import InputField from 'components/fields/InputField';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';

const AppItem = ({ title, data, onAdd, onEdit, onDelete, isSubmitting }) => {
  const [value, setValue] = useState({} as any);
  const [apps, setApps] = useState(data || ([] as any));

  const handleValue = (event) => {
    const newVal = { [event.target?.name]: event.target?.value };
    setValue({ ...value, ...newVal });
  };

  const handleAdd = () => {
    if (!value.name) return;
    value.id ? onEdit(value) : onAdd(value);
    setApps([...apps, value]);
    setValue({ ...value, name: '' });
  };

  const handleEdit = (id: string, index: string) => {
    const filteredList = apps.filter(
      (item, idx) => item.id !== id || idx !== index,
    );
    const filteredItem = apps.find(
      (item, idx) => item.id === id || idx === index,
    );
    setApps(filteredList);
    setValue({ ...filteredItem, id });
  };

  const handleDelete = (id, index) => {
    const filteredList = apps.filter((item, idx) => {
      return item.id !== id || idx !== index;
    });
    const filteredItem = apps.find(
      (item, idx) => item.id === id || idx === index,
    );
    onDelete(filteredItem.id);
    setApps(filteredList);
  };

  return (
    <div className="full">
      <div className="mb-4 mt-2 flex w-full justify-between">
        <h2 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          {title}
        </h2>
      </div>

      <div className="flex max-h-[360px] w-full flex-col gap-1 overflow-auto">
        <div className="flex w-full  flex-col gap-1 px-1 pb-10">
          {apps?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="relative w-full rounded-md border px-2 py-2"
              >
                <div className="absolute right-1 top-[43] flex gap-1">
                  <button
                    onClick={() => handleEdit(item.id, idx)}
                    className="flex h-6  w-6 items-center justify-center rounded-full border bg-[#f4f7fe] text-lg hover:bg-green-500 hover:text-white"
                  >
                    ✐
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, idx)}
                    className="flex h-6  w-6 items-center justify-center rounded-full border bg-[#f4f7fe] hover:bg-red-500 hover:text-white"
                  >
                    X
                  </button>
                </div>
                <h3 className="font-medium">{item.name}</h3>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 h-[30px] bg-white">
          <div className="relative">
            <InputField
              label=""
              onChange={handleValue}
              type="text"
              id="name"
              name="name"
              placeholder=""
              extra="mb-2 font-medium -mt-[25px] h-[30px]"
              value={value.name}
            />
            <Button
              onClick={handleAdd}
              extra="absolute right-[1px] top-0 h-7 rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md !w-[40px]"
              text=""
              icon={<MdAdd className="ml-1 h-6 w-6" />}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppItem;
