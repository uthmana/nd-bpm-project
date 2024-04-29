import React, { useRef } from 'react';

export default function EditableBox(props: {
  className?: string;
  text?: string;
  label?: string;
  children?: HTMLElement | any;
  editable?: boolean;
}) {
  const { className, text, label, editable, children } = props;
  const editableElem = useRef(null);

  const handleClick = (event) => {
    event.stopPropagation();
    if (editable) {
      editableElem.current.setAttribute('contenteditable', 'true');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-1 overflow-hidden"
    >
      <div
        ref={editableElem}
        className={`h-[30px]  border-2 border-[#000] p-1 ${
          className ? className : 'w-[36px]'
        }`}
      >
        {children ? children : text}
      </div>
      {label ? <div>{label}</div> : null}
    </div>
  );
}
