'use client';
import General from 'components/admin/profile/General';
import Notification from 'components/admin/profile/Notification';

const Setting = () => {
  return (
    <div className="flex w-full flex-col gap-5 lg:gap-5">
      <div className="mb-4 grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
        <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
          <Notification />
        </div>
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
          <General />
        </div>
      </div>
    </div>
  );
};

export default Setting;
