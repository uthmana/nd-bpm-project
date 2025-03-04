'use client';
import React, { useState } from 'react';
import ControlHeader from './controlHeader';
import ControlFooter from './controlFooter';
import ControlBody from './controlBody';
import Button from 'components/button';
import {
  getDefaultData,
  testAreaData,
} from '../finalControl/controlBody/table/defaultData';
import { deformatCurrency, formatCurrency } from 'utils';

export default function FinalControl(props: {
  data: any;
  onSubmit?: (a, b) => void;
  isSubmitting?: boolean;
  variant?: string;
}) {
  const { data, onSubmit, isSubmitting, variant = 'input' } = props;

  const { fault, finalControl, machineName } = data;
  const isUpdate = finalControl?.id !== undefined;

  const [values, setValues] = useState(
    isUpdate
      ? {
          ...finalControl,
          kontrol_edilen_miktar: formatCurrency(
            finalControl?.kontrol_edilen_miktar,
            'int',
          ),
          hatali_miktar: formatCurrency(finalControl?.hatali_miktar, 'int'),
          nakliye_miktar: formatCurrency(finalControl?.nakliye_miktar, 'int'),
          machineName,
        }
      : {
          machineName,
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

    const updatedVal = {
      ...values,
      kontrol_edilen_miktar: deformatCurrency(
        values?.kontrol_edilen_miktar,
        'int',
      ),
      hatali_miktar: deformatCurrency(values?.hatali_miktar, 'int'),
      nakliye_miktar: deformatCurrency(values?.nakliye_miktar, 'int'),
    };
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
      <ControlHeader
        data={fault}
        variant="proccess"
        title="Final / Çıkış Kontrol Formu"
        titleEn="Final / Output Inspection Record"
      />
      <ControlBody
        fault={fault}
        data={values}
        onChange={handleChange}
        variant={variant}
      />
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
