'use client';

import {
  addApplication,
  deleteApplication,
  getApplication,
  updateApplication,
} from 'app/lib/apiRequest';
import { useState } from 'react';
import AppItem from './appItem';

const ApplicationList = ({ data }) => {
  const [apps, setApps] = useState(data || ([] as any));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getApplications = async () => {
    const { status, data } = await getApplication();
    if (status === 200) {
      setApps(data);
    }
  };

  const handleAdd = async (val) => {
    setIsSubmitting(true);
    const { status, data } = await addApplication(val);
    if (status === 200) {
      getApplications();
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (val) => {
    setIsSubmitting(true);
    const { status, data } = await updateApplication(val);
    if (status === 200) {
      getApplications();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (val) => {
    setIsSubmitting(true);
    const { status, data } = await deleteApplication(val);
    if (status === 200) {
      getApplications();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="full">
      <AppItem
        key={apps?.length}
        title="Uygulama Yönetimi"
        data={apps}
        onAdd={(v) => handleAdd(v)}
        onEdit={(v) => handleEdit(v)}
        onDelete={(v) => handleDelete(v)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ApplicationList;
