import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

type Search = {
  extra?: string;
  onChange?: (e: any) => void;
  onSubmit?: (e: any) => void;
  debounce?: number;
};

const Search = ({ extra, onSubmit, onChange, debounce = 500 }: Search) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(searchText);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(searchText);
      }}
      className={`flex h-[48px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px] ${extra}`}
    >
      <p className="pl-3 pr-2 text-xl">
        <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
      </p>
      <input
        type="text"
        onKeyUp={(e) => onChange(searchText)}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Arama..."
        className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
      />
    </form>
  );
};

export default Search;
