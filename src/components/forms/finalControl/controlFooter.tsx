import React from 'react';

export default function ControlFooter({ data }) {
  return (
    <div className="flex w-full grid-cols-2 justify-around text-sm font-medium">
      <div>
        <div>
          Testi Gerçekleştiren / <br />
          <span className="text-xs italic">QC Inspector</span>
        </div>
        <div>{data?.inspector}</div>
      </div>
      <div>
        <div>
          Onaylayan / <br />
          <span className="text-xs italic"> QC Supervisor</span>
        </div>
        <div>{data?.supervisor}</div>
      </div>
    </div>
  );
}
