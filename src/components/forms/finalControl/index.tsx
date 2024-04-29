'use client';
import React from 'react';
import ControlHeader from './controlHeader';
import ControlFooter from './controlFooter';
import ControlBody from './controlBody';

export default function FinalControl({ data }) {
  return (
    <div className="w-full">
      <ControlHeader data={data} />
      <ControlBody data={data} />
      <ControlFooter data={data} />
    </div>
  );
}
