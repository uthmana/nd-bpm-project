'use client';

import {
  addColor,
  deleteColor,
  getColor,
  updateColor,
} from 'app/lib/apiRequest';
import { useState } from 'react';
import AppItem from './appItem';

const ColorList = ({ data }) => {
  const [colors, setColors] = useState(data || ([] as any));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getColors = async () => {
    const { status, data } = await getColor();
    if (status === 200) {
      setColors(data);
    }
  };

  const handleAdd = async (val) => {
    setIsSubmitting(true);
    const { status, data } = await addColor(val);
    if (status === 200) {
      getColors();
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (val) => {
    setIsSubmitting(true);
    const { status, data } = await updateColor(val);
    if (status === 200) {
      getColors();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (val) => {
    setIsSubmitting(true);
    const { status, data } = await deleteColor(val);
    if (status === 200) {
      getColors();
    }
    setIsSubmitting(false);
  };
  return (
    <div className="full">
      <AppItem
        key={colors?.length}
        title="Renk Yönetimi"
        data={colors}
        onAdd={(v) => handleAdd(v)}
        onEdit={(v) => handleEdit(v)}
        onDelete={(v) => handleDelete(v)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ColorList;
