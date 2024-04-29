import React, { useRef, useState } from 'react';
import Patch from './patch';
import EzDrive from './ezDrive';
import Mikrokapsul from './mikrokapsul';
import Diger from './diger';

export default function TestTable({ data, onChange }) {
  const [values, setValues] = useState(data || ({} as any));

  const getApplicationType = (application) => {
    let appName = application?.toLowerCase();
    if (!appName) return 'diger';

    if (
      appName.includes('patch') ||
      appName.includes('strip') ||
      appName.includes('vibra-tite')
    ) {
      return 'patch';
    }
    if (appName.includes('microspheres') || appName.includes('driloc')) {
      return 'mikrokapsul';
    }
    if (appName.includes('ez-drive')) {
      return 'ezDrive';
    }
    return 'diger';
  };

  const getControlTypeTable = (type) => {
    const handleChange = (val) => {
      setValues({ ...values, ...val });
      onChange({ ...values, ...val });
    };

    // if (type === 'patch') {
    //   return <Patch data={values} onChange={handleChange} />;
    // }

    // if (type === 'ezDrive') {
    //   return <EzDrive data={values} onChange={handleChange} />;
    // }

    // if (type === 'mikrokapsul') {
    //   return <Mikrokapsul data={values} onChange={handleChange} />;
    // }

    return <Diger data={values} onChange={handleChange} />;
  };

  return (
    <div className="w-full">
      {getControlTypeTable(getApplicationType(values?.application))}
    </div>
  );
}
