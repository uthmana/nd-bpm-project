import React from 'react';

export default function Patch({ data, onChange }) {
  return <div onClick={() => onChange('Patch')}>{data.customerName}</div>;
}
