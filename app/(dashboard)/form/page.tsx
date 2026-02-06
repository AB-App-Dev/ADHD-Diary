"use client";

export const dynamic = 'force-dynamic';

import React from 'react';
import WorkdayForm from '@/app/(dashboard)/form/workday/page';
import WeekendForm from '@/app/(dashboard)/form/weekend/page';

export default function FormPage() {

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  return <div>
    {isWeekend ? <WeekendForm /> : <WorkdayForm />}
  </div>
}
