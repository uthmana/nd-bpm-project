'use client';
import { MdFileUpload } from 'react-icons/md';
import Card from 'components/card';
import { useRef, useState } from 'react';
import { uploadFile } from 'app/lib/apiRequest';

const Upload = () => {
  const fileElem = useRef(null);
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');

  const handleClick = async (e) => {
    e.preventDefault();
    fileElem.current.click();
    fileElem.current.value = null;
  };

  const handleOnChange = async (e) => {
    const fileData = e.target.files[0];
    if (!fileData) return;
    // const { status, data: res } = await uploadFile(fileData);
    // if (status === 200) {
    //   alert(res.path);
    // }
    try {
      const data = new FormData();
      data.set('file', fileData);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      // handle the error
      if (!res.ok) throw new Error(await res.text());
      const { path, name } = await res.json();
      setFilePath(path);
      setFileName(name);
    } catch (e: any) {
      // Handle errors here
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
      // handle the error
      if (!res.ok) throw new Error(await res.text());
      setFilePath('');
      setFileName('');
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-11">
      <form className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
        <input
          ref={fileElem}
          type="file"
          name="file"
          onChange={handleOnChange}
          hidden
        />
        <button
          onClick={handleClick}
          type="submit"
          className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0"
        >
          <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
          <h4 className="text-xl font-bold text-brand-500 dark:text-white">
            Upload Files
          </h4>
          <p className="mt-2 text-sm font-medium text-gray-600">
            PNG, JPG and GIF files are allowed
          </p>
        </button>
      </form>

      {fileName.length > 0 ? (
        <div className="relative w-full">
          <button
            onClick={handleFileDelete}
            className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 p-2 text-white"
          >
            x
          </button>
          <img className="w-full" src={filePath} />
        </div>
      ) : null}

      <div className="col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-white pb-4 pl-3 dark:!bg-navy-800">
        <h4 className="text-left text-xl font-bold leading-9 text-navy-700 dark:text-white">
          Complete Your Profile
        </h4>
        <p className="leading-1 mt-2 text-base font-normal text-gray-600">
          Stay on the pulse of distributed projects with an anline whiteboard to
          plan, coordinate and discuss
        </p>
        <button
          type="submit"
          className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Publish now
        </button>
      </div>
    </Card>
  );
};

export default Upload;
