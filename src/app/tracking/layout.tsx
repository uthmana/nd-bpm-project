'use client';

const Tracking = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1024px] px-8">
        <header className="flex w-full justify-between py-5">
          <div>logo</div>
          <div>contact info</div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Tracking;
