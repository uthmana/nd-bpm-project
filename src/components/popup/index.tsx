import React, { ReactNode } from 'react';

type Popup = {
  extra?: string;
  onClose?: (e?: any) => void;
  children?: ReactNode;
  show?: boolean;
};

export default function Popup({ children, show, extra, onClose }: Popup) {
  const handleClose = (e) => {
    onClose && onClose();
  };

  if (!show) {
    return null;
  }
  return (
    <div className="popup-container" onClick={handleClose}>
      <div className={`popup-body ${extra}`}>{children}</div>
    </div>
  );
}
