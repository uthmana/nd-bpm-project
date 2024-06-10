'use client';

import Footer from 'components/footer/Footer';
import { MdLocalPhone } from 'react-icons/md';
import nd_logo from '/public/img/auth/nd_logo.webp';

const Tracking = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1024px] px-8">
        <header className="mb-4 flex w-full items-center justify-between border-b py-5">
          <div className="w-[80px]">
            <img className="w-full" src={nd_logo.src} />
          </div>
          <a
            className="flex cursor-pointer gap-3 text-lg font-bold hover:text-green-600"
            href="tel:+905426963769"
          >
            <MdLocalPhone className="h-6 w-6 text-green-600" /> 0542 696 37 69
          </a>
        </header>
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Tracking;
