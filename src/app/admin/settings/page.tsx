'use client';
import Card from 'components/card';
import MachineList from 'components/settings/machineList';
import { log } from 'utils';
import ApplicationList from 'components/settings/applicationList';
import StandardList from 'components/settings/standardList';
import ColorList from 'components/settings/colorList';
import { useEffect, useState } from 'react';
import { getFaultSettings } from 'app/lib/apiRequest';

const Setting = () => {
  const [apps, setApps] = useState([] as any);

  useEffect(() => {
    const fetchData = async () => {
      const { status, data } = await getFaultSettings();
      if (status === 200) {
        setApps(data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex w-full flex-col gap-5 lg:gap-5">
      <div className="w-full">
        <Card extra={'w-full h-full py-7 px-4'}>
          <MachineList />
        </Card>
      </div>
      <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card extra="w-full py-7 px-4">
          <ApplicationList
            key={apps?.applications?.length}
            data={apps?.applications}
          />
        </Card>
        <Card extra="w-full py-7 px-4">
          <StandardList key={apps?.standards?.length} data={apps?.standards} />
        </Card>
        <Card extra="w-full py-7 px-4">
          <ColorList key={apps?.colors?.length} data={apps?.colors} />
        </Card>
      </div>
    </div>
  );
};

export default Setting;
