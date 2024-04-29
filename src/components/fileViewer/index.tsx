import React from 'react';
import { MdAttachFile } from 'react-icons/md';

export default function FileViewer({ file }) {
  // if (!file) return null;
  // return (
  //   <a href={`/uploads/${file}`} target="_blank">
  //     <MdAttachFile className="h-6 w-6" />
  //   </a>
  // );
  if (!file) return null;
  return (
    // <a href={`/uploads/${file}`} target="_blank">
    //   <MdAttachFile className="h-6 w-6" />
    // </a>
    <a href={`${file}`} target="_blank">
      <MdAttachFile className="h-6 w-6" />
    </a>
  );
}
