'use client';
import Card from 'components/card';
import MachineList from 'components/settings/machineList';
import { useEffect, useState } from 'react';
import {
  addApplication,
  addColor,
  addStandard,
  deleteApplication,
  deleteColor,
  deleteStandard,
  getFaultSettings,
  updateApplication,
  updateColor,
  updateStandard,
} from 'app/lib/apiRequest';
import { SettingsSkeleton } from 'components/skeleton';
import { getResError } from 'utils/responseError';
import { toast } from 'react-toastify';
import AppItem from 'components/settings/appItem';

const Setting = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [application, setApplication] = useState([]);
  const [standard, setStandard] = useState([]);
  const [color, setColor] = useState([]);
  const [machine, setMachine] = useState([]);

  const [isAppSubmitting, setIsAppSubmitting] = useState(false);
  const [isStandardSubmitting, setIsStandardSubmitting] = useState(false);
  const [isColorSubmitting, setIsColorSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await getFaultSettings();
        setApplication(data?.applications);
        setStandard(data?.standards);
        setColor(data?.colors);
        setMachine(data?.machines);
        setIsLoading(false);
      } catch (error) {
        const message = getResError(error?.message);
        toast.error(`${message}`);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApplication = async (val) => {
    try {
      setIsAppSubmitting(true);
      const { action, ...rest } = val;
      if (!val?.id) {
        const { data } = await addApplication(rest);
        setApplication(data);
        setIsAppSubmitting(false);
        return;
      }
      if (val?.action === 'delete') {
        const { data } = await deleteApplication(rest.id);
        setApplication(data);
        setIsAppSubmitting(false);
        return;
      }
      const { data } = await updateApplication(rest);
      setApplication(data);
      setIsAppSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsAppSubmitting(false);
    }
  };

  const handleStandardAdd = async (val) => {
    try {
      setIsStandardSubmitting(true);
      const { action, ...rest } = val;
      if (!val?.id) {
        const { data } = await addStandard(rest);
        setStandard(data);
        setIsStandardSubmitting(false);
        return;
      }
      if (val?.action === 'delete') {
        const { data } = await deleteStandard(rest.id);
        setStandard(data);
        setIsStandardSubmitting(false);
        return;
      }
      const { data } = await updateStandard(rest);
      setStandard(data);
      setIsStandardSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsStandardSubmitting(false);
    }
  };

  const handleColordAdd = async (val) => {
    try {
      setIsColorSubmitting(true);
      const { action, ...rest } = val;
      if (!val?.id) {
        const { data } = await addColor(rest);
        setColor(data);
        setIsColorSubmitting(false);
        return;
      }
      if (val?.action === 'delete') {
        const { data } = await deleteColor(rest.id);
        setColor(data);
        setIsColorSubmitting(false);
        return;
      }
      const { data } = await updateColor(rest);
      setColor(data);
      setIsColorSubmitting(false);
    } catch (error) {
      const message = getResError(error?.message);
      toast.error(`${message}`);
      setIsColorSubmitting(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <SettingsSkeleton />
      ) : (
        <div className="flex w-full flex-col gap-5 lg:gap-5">
          <div className="w-full">
            <Card extra={'w-full h-full py-7 px-4'}>
              <MachineList data={machine} />
            </Card>
          </div>
          <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Card extra="w-full py-7 px-4">
              <AppItem
                title="Uygulama Yönetimi"
                key={'app'}
                onSubmit={handleApplication}
                data={application}
                isSubmitting={isAppSubmitting}
              />
            </Card>
            <Card extra="w-full py-7 px-4">
              <AppItem
                title="Standart Yönetimi"
                key={'standard'}
                data={standard}
                onSubmit={handleStandardAdd}
                isSubmitting={isStandardSubmitting}
              />
            </Card>
            <Card extra="w-full py-7 px-4">
              <AppItem
                title="Renk Yönetimi"
                key={'color'}
                data={color}
                onSubmit={handleColordAdd}
                isSubmitting={isColorSubmitting}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
