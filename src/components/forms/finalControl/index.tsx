'use client';
import React, { useState } from 'react';
import ControlHeader from './controlHeader';
import ControlFooter from './controlFooter';
import ControlBody from './controlBody';
import Button from 'components/button/button';
import {
  getDefaultData,
  testAreaData,
} from '../finalControl/controlBody/table/defaultData';

export default function FinalControl(props: {
  data: any;
  onSubmit?: (a, b) => void;
  isSubmitting?: boolean;
  variant?: string;
}) {
  const { data, onSubmit, isSubmitting, variant = 'input' } = props;
  const { faultId, id, paketleme, createdBy, finalControl, machineName } = data;

  const isUpdate = finalControl?.length > 0;
  const [values, setValues] = useState(
    isUpdate
      ? {
          faultId,
          machineName,
          processId: id,
          createdBy,
          paketleme: finalControl[0]?.paketleme,
          kontrol_edilen_miktar: finalControl[0]?.kontrol_edilen_miktar,
          hatali_miktar: finalControl[0]?.hatali_miktar,
          nakliye_miktar: finalControl[0]?.nakliye_miktar,
          result: finalControl[0]?.result,
          testItem: finalControl[0]?.testItem,
          testArea: finalControl[0]?.testArea,
        }
      : {
          faultId,
          machineName,
          processId: id,
          createdBy: '',
          paketleme: '',
          kontrol_edilen_miktar: 0,
          hatali_miktar: 0,
          nakliye_miktar: 0,
          result: '',
          testItem: getDefaultData(machineName),
          testArea: testAreaData,
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
    setValues({ ...values, ...val });
  };

  const handleQcChange = (val) => {
    setValues({ ...values, paketleme: val.paketleme });
  };

  return (
    <div className="w-full">
      <ControlHeader data={data} />
      <ControlBody data={values} onChange={handleChange} variant={variant} />
      <ControlFooter
        data={values}
        onChange={handleQcChange}
        variant={variant}
      />
      {variant == 'input' ? (
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          extra="mt-5 print:hidden"
          text="KAYDET"
          disabled={values?.result?.length === 0}
        />
      ) : null}
    </div>
  );
}
