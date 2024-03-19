'use client';

import React, { useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

function SignaturePad({ onSave, value, label }) {
  const [sign, setSign] = useState({} as any);
  const [clear, setClear] = useState(false);

  const handleClear = (e) => {
    e.preventDefault();
    sign.clear();
    onSave('');
    setClear(true);
  };
  const handleGenerate = () => {
    onSave(sign.getTrimmedCanvas().toDataURL('image/png'));
  };

  return (
    <div className="full">
      {label ? (
        <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
          {label}
        </label>
      ) : null}
      <div className="relative h-[200px] w-full border dark:border-white/25">
        {value && !clear ? (
          <div className="absolute flex h-full w-full items-center justify-center">
            <img className="" src={value} />
          </div>
        ) : null}

        <SignatureCanvas
          onEnd={handleGenerate}
          penColor="blue"
          canvasProps={{
            width: 330,
            height: 200,
            className: 'sigCanvas',
          }}
          ref={(data) => setSign(data)}
        />

        <button
          className="absolute bottom-0 z-[2] w-fit rounded-md border px-2 py-[2px] hover:bg-gray-500 dark:text-white"
          onClick={handleClear}
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}
export default SignaturePad;
