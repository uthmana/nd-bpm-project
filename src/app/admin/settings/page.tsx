'use client';
import Card from 'components/card';
import MachineList from 'components/settings/machineList';
import { log } from 'utils';
import ApplicationList from 'components/settings/applicationList';
import StandardList from 'components/settings/standardList';
import ColorList from 'components/settings/colorList';

const Setting = () => {
  return (
    <div className="flex w-full flex-col gap-5 lg:gap-5">
      <div className="w-full">
        <Card extra={'w-full h-full py-7 px-4'}>
          <MachineList />
        </Card>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card extra="w-full py-7 px-4">
          <ApplicationList />
        </Card>
        <Card extra="w-full py-7 px-4">
          <StandardList />
        </Card>
        <Card extra="w-full py-7 px-4">
          <ColorList />
        </Card>
      </div>
    </div>
  );
};

export default Setting;
