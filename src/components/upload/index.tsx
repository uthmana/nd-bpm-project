'use client';
import { MdFileUpload } from 'react-icons/md';
import Card from 'components/card';
import { useRef, useState } from 'react';
import placeholderImage from '/public/img/others/placeholder-image.svg';

const Upload = (props: {
  onChange: (val: string) => void;
  fileType?: string;
  multiple?: boolean;
  _fileName?: string;
  _filePath?: string;
}) => {
  const { onChange, fileType, multiple = false, _fileName, _filePath } = props;
  const fileElem = useRef(null);
  const [filePath, setFilePath] = useState(_filePath ? _filePath : '');
  const [fileName, setFileName] = useState(_fileName ? _fileName : '');

  const supportedFiles = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ];

  const handleClick = async (e) => {
    e.preventDefault();
    fileElem.current.click();
    fileElem.current.value = null;
  };

  const handleOnChange = async (e) => {
    const fileData = multiple ? e.target.files : e.target.files[0];
    if (!fileData) return;
    try {
      if (!supportedFiles.includes(fileData.type)) return;
      const data = new FormData();
      data.set('file', fileData);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
      const { path, name } = await res.json();
      setFilePath(path);
      setFileName(name);
      onChange(name);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleFileDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        body: JSON.stringify({ name: fileName }),
      });
      if (!res.ok) throw new Error(await res.text());
      setFilePath('');
      setFileName('');
      onChange('');
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <Card className="flex h-full w-full flex-col gap-3  rounded-[20px] bg-white bg-clip-border font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none sm:flex-row">
      <div className="h-[164px] w-full rounded-xl bg-lightPrimary dark:!bg-navy-700">
        <input
          ref={fileElem}
          type="file"
          name="file"
          onChange={handleOnChange}
          hidden
          multiple={multiple}
        />
        <button
          onClick={handleClick}
          type="submit"
          className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0"
        >
          <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
          <h4 className="text-xl font-bold text-brand-500 dark:text-white">
            Dosya Ükle
          </h4>
          <p className="mt-2 text-sm font-medium text-gray-600">
            PNG, JPG and pdf dosyları destekleniyor
          </p>
        </button>
      </div>

      <div
        className="h-[164px] w-full overflow-hidden rounded-xl bg-white bg-contain dark:!bg-navy-800"
        style={{ backgroundImage: `url(${placeholderImage.src})` }}
      >
        {fileName.length > 0 ? (
          <div className="relative h-full w-full">
            <button
              onClick={handleFileDelete}
              className="absolute left-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-700 p-2 text-white hover:bg-red-600"
            >
              x
            </button>

            <iframe
              src={filePath}
              height="100%"
              width="100%"
              title={fileName}
            ></iframe>
            {/* <img className="h-full w-full"  /> */}
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default Upload;
