import React, { useRef } from 'react';

export default function Box(props: {
  className?: string;
  text?: string;
  label?: string;
  children?: HTMLElement | any;
  editable?: boolean;
}) {
  const { className, text, label, editable, children } = props;
  const editableElem = useRef(null);

  return (
    <div className="flex items-center gap-1 overflow-hidden">
      <div
        ref={editableElem}
        className={`flex  h-[32px] items-center border border-[#000] px-1 ${
          className ? className : 'min-w-[60px]'
        }`}
      >
        {children ? children : text}
      </div>
      {label ? <div>{label}</div> : null}
    </div>
  );
}
