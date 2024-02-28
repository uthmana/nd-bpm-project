'use client';

import { useState } from 'react';
import AppItem from './appItem';
import {
  addStandard,
  updateStandard,
  deleteStandard,
  getStandard,
} from 'app/lib/apiRequest';

const StandardList = ({ data }) => {
  const [standards, setStandards] = useState(data || ([] as any));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStandards = async () => {
    const { status, data } = await getStandard();
    if (status === 200) {
      setStandards(data);
    }
  };

  const handleAdd = async (val) => {
    setIsSubmitting(true);
    const { status } = await addStandard(val);
    if (status === 200) {
      getStandards();
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (val) => {
    setIsSubmitting(true);
    const { status } = await updateStandard(val);
    if (status === 200) {
      getStandards();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (val) => {
    setIsSubmitting(true);
    const { status } = await deleteStandard(val);
    if (status === 200) {
      getStandards();
    }
    setIsSubmitting(false);
  };
  return (
    <div className="full">
      <AppItem
        key={standards?.length}
        title="Standart Yönetimi"
        data={standards}
        onAdd={(v) => handleAdd(v)}
        onEdit={(v) => handleEdit(v)}
        onDelete={(v) => handleDelete(v)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default StandardList;
