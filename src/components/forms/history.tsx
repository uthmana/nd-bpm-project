'use client';

import React, { useState } from 'react';

type FaultMeta = {
  createdAt: string; // ISO 8601 date string
  arrivalDate: string; // ISO 8601 date string
  faultDescription: string;
};

type ProcessMeta = {
  createdAt: string; // ISO 8601 date string
  createdBy: string;
  shipmentQty: number;
  product_barcode: string;
  status: string;
};

type FaultControlMeta = {
  processFrequency: string;
  arrivalDate: string | null; // can be null
  controlDate: string; // ISO 8601 date string
  frequencyDimension: string;
  remarks: string;
  traceabilityCode: string | null; // can be null
};

type InvoiceMeta = {
  invoiceDate: string; // ISO 8601 date string
  amount: number | null; // can be null
  address: string;
  createdAt: string; // ISO 8601 date string
  createdBy: string | null; // can be null
  tax_Office: string;
  status: string;
  totalAmount: number | null; // can be null
};

type OfferMeta = any[]; // Assuming it is an array, as it is empty in the provided JSON

export type MetaData = {
  faultMeta: FaultMeta[];
  processMeta: ProcessMeta;
  faultControlMeta: FaultControlMeta;
  applicationMeta: any | null; // can be null, type unknown based on provided JSON
  invoiceMeta: InvoiceMeta[];
  offerMeta: OfferMeta;
};

interface HistoryFormProps {
  formData: MetaData;
}

export default function HistoryForm(props: HistoryFormProps) {
  const formData = props.formData;

  const renderValue = (val: any) => {
    if (Array.isArray(val)) {
      return val.map((item, index) => (
        <div key={index} className="ml-4">
          {typeof item === 'object' ? (
            <div>
              {Object.entries(item).map(([subKey, subVal]) => (
                <div key={subKey} className="mb-1 ml-2">
                  <h4 className="font-semibold">{subKey}:</h4>
                  <p className="text-gray-600">{String(subVal)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">{String(item)}</p>
          )}
        </div>
      ));
    } else if (typeof val === 'object') {
      return (
        <div className="ml-4">
          {Object.entries(val ? val : {}).map(([subKey, subVal]) => (
            <div key={subKey} className="mb-1 ml-2">
              <h4 className="font-semibold">{subKey}:</h4>
              <p className="text-gray-600">{String(subVal)}</p>
            </div>
          ))}
        </div>
      );
    } else {
      return <p className="text-gray-600">{String(val ? val : '')}</p>;
    }
  };

  const renderMetaSection = (
    title: string,
    meta: any,
    isOpen: boolean,
    toggleOpen: () => void,
  ) => (
    <div className="mb-5 rounded-lg border border-gray-300 p-4 shadow-lg">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={toggleOpen}
      >
        <h2 className="text-xl font-semibold text-blue-700">{title}</h2>
        <span className="text-gray-500">{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="mt-3">
          {meta ? (
            Object.entries(meta).map(([key, val]) => (
              <div key={key} className="mb-2">
                <h3 className="font-bold text-gray-700">{key}</h3>
                {renderValue(val)}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      )}
    </div>
  );

  const [faultControlOpen, setFaultControlOpen] = useState(false);
  const [processMetaOpen, setProcessMetaOpen] = useState(false);
  const [offerMetaOpen, setOfferMetaOpen] = useState(false);
  const [faultMetaOpen, setFaultMetaOpen] = useState(false);
  const [applicationMetaOpen, setApplicationMetaOpen] = useState(false);

  return (
    <div className="w-full bg-gray-100 p-5">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Meta Information
      </h1>
      {renderMetaSection(
        'Fault Control Meta',
        formData.faultControlMeta,
        faultControlOpen,
        () => setFaultControlOpen(!faultControlOpen),
      )}
      {renderMetaSection(
        'Process Meta',
        formData.processMeta,
        processMetaOpen,
        () => setProcessMetaOpen(!processMetaOpen),
      )}
      {renderMetaSection('Offer Meta', formData.offerMeta, offerMetaOpen, () =>
        setOfferMetaOpen(!offerMetaOpen),
      )}
      {renderMetaSection('Fault Meta', formData.faultMeta, faultMetaOpen, () =>
        setFaultMetaOpen(!faultMetaOpen),
      )}
      {renderMetaSection(
        'Application Meta',
        formData.applicationMeta ? formData.applicationMeta[0] : null,
        applicationMetaOpen,
        () => setApplicationMetaOpen(!applicationMetaOpen),
      )}
    </div>
  );
}
