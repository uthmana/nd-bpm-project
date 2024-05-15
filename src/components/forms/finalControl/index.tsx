'use client';
import React, { useState } from 'react';
import ControlHeader from './controlHeader';
import ControlFooter from './controlFooter';
import ControlBody from './controlBody';
import Button from 'components/button/button';
import { getDefaultData } from '../finalControl/controlBody/table/defaultData';

export default function FinalControl({ data, onSubmit, isSubmitting }) {
  const { faultId, id, updatedBy, inspector, finalControl, machineName } = data;
  const isUpdate = finalControl?.length > 0;
  const [values, setValues] = useState(
    isUpdate
      ? {
          faultId,
          machineName,
          processId: id,
          updatedBy,
          result: finalControl[0]?.result,
          testItem: finalControl[0]?.testItem,
        }
      : {
          faultId,
          machineName,
          processId: id,
          createdBy: inspector,
          result: '',
          testItem: getDefaultData(machineName),
        },
  );

  const handleSubmit = () => {
    if (!values.result) {
      return;
    }
    const updatedVal = { ...values };
    delete updatedVal.machineName;
    onSubmit(updatedVal, isUpdate);
  };

  const handleChange = (val) => {
    setValues(val);
  };

  return (
    <div className="w-full">
      <ControlHeader data={data} />
      <ControlBody data={values} onChange={handleChange} />
      <ControlFooter data={data} />
      <Button
        onClick={handleSubmit}
        loading={isSubmitting}
        extra="mt-5 print:hidden"
        text="KAYDET"
        disabled={values?.result?.length === 0}
      />
    </div>
  );
}
