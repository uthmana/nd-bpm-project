import React, { useRef, useState } from 'react';
import Patch from '../patch';
import EzDrive from '../ezDrive';
import Mikrokapsul from '../mikrokapsul';
import Diger from '../diger';
import './table.css';

export default function TestTable({ data, onChange, variant, machineName }) {
  const [values, setValues] = useState(data || ({} as any));

  const getApplicationType = (machineName) => {
    let appName = machineName?.toLowerCase();
    if (!appName) return 'diger';

    if (appName.includes('patch')) {
      return 'patch';
    }
    if (appName.includes('mikrokapsül')) {
      return 'mikrokapsul';
    }
    if (appName.includes('ez-drive')) {
      return 'ezDrive';
    }
    return 'diger';
  };

  const getControlTypeTable = (type) => {
    const handleChange = (val) => {
      setValues(val);
      onChange(val);
    };

    if (type === 'patch') {
      return <Patch data={values} variant={variant} onChange={handleChange} />;
    }

    if (type === 'ezDrive') {
      return (
        <EzDrive data={values} variant={variant} onChange={handleChange} />
      );
    }

    if (type === 'mikrokapsul') {
      return (
        <Mikrokapsul data={values} variant={variant} onChange={handleChange} />
      );
    }

    return <Diger data={values} variant={variant} onChange={handleChange} />;
  };

  return (
    <div className="w-full">
      {getControlTypeTable(getApplicationType(machineName))}
    </div>
  );
}
