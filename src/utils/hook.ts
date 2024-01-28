'use client';

import { useState } from 'react';

export const useDrage = () => {
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
    e.currentTarget.classList.add('dragging-active');
  };

  const handleMouseLeave = (e) => {
    setIsDown(false);
    e.currentTarget.classList.remove('dragging-active');
  };

  const handleMouseUp = (e) => {
    setIsDown(false);
    e.currentTarget.classList.remove('dragging-active');
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 3; // scroll-fast
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  return { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove };
};
