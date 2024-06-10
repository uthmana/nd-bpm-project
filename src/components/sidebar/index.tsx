/* eslint-disable */

import { HiX } from 'react-icons/hi';
import Links from './components/Links';
import { IRoute } from 'types/navigation';
import nd_logo from '/public/img/auth/nd_logo.webp';

function SidebarHorizon(props: { routes: IRoute[]; [x: string]: any }) {
  const { routes, open, setOpen, user } = props;

  const handleOpen = () => {
    if (window?.innerWidth < 1200) {
      setTimeout(() => {
        setOpen(false);
      }, 500);
    }
  };

  return (
    <div
      className={`duration-175 linear sm:none fixed !z-50 flex min-h-full flex-col bg-white  pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 print:hidden ${
        open ? 'translate-x-0' : '-translate-x-96'
      }`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={`absolute left-0 top-0 -z-[50] h-screen w-screen xl:hidden ${
          !open ? 'pointer-events-none hidden ' : ''
        }`}
      >
        <span className="hidden">overlay</span>
      </div>
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={() => setOpen(false)}
      >
        <HiX />
      </span>

      <div className={`ml-[30px] mr-[70px] mt-[50px] flex items-center`}>
        <div className="mt-4 flex h-2.5 items-center font-poppins text-[20px] font-bold uppercase text-navy-700 dark:text-white">
          <span className="mr-2 inline-block w-12">
            value
            <img className="w-inherit" src={nd_logo.src} />
          </span>
          <span className="font-medium">TR Proses</span>
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto w-full pt-1">
        <Links onClick={handleOpen} routes={routes} />
      </ul>

      {/* Nav item end */}
    </div>
  );
}

export default SidebarHorizon;
