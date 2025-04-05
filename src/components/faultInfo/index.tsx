import React, { LegacyRef, useRef } from 'react';
import { formatDateTime, faultInfo, infoTranslate } from '../../utils';
import FileViewer from '../fileViewer';
import Barcode from 'react-jsbarcode';
import { Fault } from '../../../src/app/localTypes/types';

export default function FaultInfo(props: {
  fault: Fault;
  techAttachments?: any;
  frequency?: number | null | undefined;
  barcodeRef?: LegacyRef<HTMLDivElement>;
}) {
  const { fault, techAttachments, frequency, barcodeRef } = props;

  const renderProductInfo = (key, val) => {
    if (key === 'arrivalDate') {
      return <p className="font-bold"> {formatDateTime(val)} </p>;
    }
    if (key === 'technicalDrawingAttachment') {
      if (techAttachments) {
        return (
          <span className="flex gap-1">
            {techAttachments?.map((item, idx) => {
              if (!item) return null;
              return <FileViewer file={item} key={idx} />;
            })}
          </span>
        );
      }

      return <FileViewer file={val} />;
    }
    if (key === 'arrivalDate') {
      return <p className="font-bold"> {formatDateTime(val)} </p>;
    }
    if (key === 'product_barcode') {
      return (
        <div ref={barcodeRef} className="max-w-[200px]">
          <Barcode
            className="h-full w-full print:w-[500px]"
            value={val}
            options={{ format: 'code128' }}
          />
        </div>
      );
    }
    return <p className="break-all font-bold"> {val} </p>;
  };

  return (
    <div className="mb-10 grid w-full grid-cols-2 gap-2  md:grid-cols-3 lg:grid-cols-4">
      {fault
        ? Object.entries(fault).map(([key, val]: any, index) => {
            if (faultInfo.includes(key)) {
              return (
                <div key={index} className="mb-5 flex flex-col flex-nowrap">
                  <h4 className="mx-1 italic">{infoTranslate[key]}</h4>
                  {renderProductInfo(key, val)}
                </div>
              );
            }
          })
        : null}
      {frequency ? (
        <div className="mb-5 flex flex-col flex-nowrap">
          <h4 className="mx-1 italic">Frekans Aralığı (dk)</h4>
          <p className="text-lg font-bold text-brand-500">{frequency}</p>
        </div>
      ) : null}
    </div>
  );
}
