'use client';
import { MdFileUpload } from 'react-icons/md';
import Card from 'components/card';
import { useRef, useState } from 'react';
import placeholderImage from '/public/img/others/placeholder-image.svg';
import type { PutBlobResult } from '@vercel/blob';


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
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const data = new FormData();
      data.set('file', fileData);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
      //const { path, name } = await res.json();

      const { url, pathname, downloadUrl } =
        (await res.json()) as PutBlobResult;
       // setFilePath(path);
      // setFileName(name);
      // onChange(name);
      setFilePath(url);
      setFileName(url);
      onChange(url);
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleFileDelete = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        body: JSON.stringify({ name: fileName }),
      });
      if (!res.ok) throw new Error(await res.text());
      setFilePath('');
      setFileName('');
      onChange('');
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <Card className="flex h-full w-full flex-col gap-3  rounded-[20px] bg-white/0 bg-clip-border font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none sm:flex-row">
      <div className="h-[164px] w-full rounded-xl bg-white/0">
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
            Dosya Yükle
          </h4>
          <p className="mt-2 text-sm font-medium text-gray-600">
            PNG, JPG and pdf dosyları destekleniyor
          </p>
        </button>
      </div>

      <div
        className="h-[164px] w-full overflow-hidden rounded-xl bg-white bg-contain dark:!bg-navy-800"
        style={{
          backgroundImage: `url(${placeholderImage.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {loading ? (
          <div className="relative bottom-0 mb-auto w-full rounded bg-gray-200">
            <div className="shim-blue absolute top-0 h-2 w-full rounded"></div>
          </div>
        ) : null}

        {fileName?.length > 0 ? (
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
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default Upload;
