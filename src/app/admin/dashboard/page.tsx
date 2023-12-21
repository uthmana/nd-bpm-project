'use client';
import MiniCalendar from 'components/calendar/MiniCalendar';
import WeeklyRevenue from 'components/admin/default/WeeklyRevenue';
import TotalSpent from 'components/admin/default/TotalSpent';
import PieChartCard from 'components/admin/default/PieChartCard';
import { IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart, MdDashboard } from 'react-icons/md';

import Widget from 'components/widget/Widget';
import CheckTable from 'components/admin/default/CheckTable';
import ComplexTable from 'components/admin/default/ComplexTable';
import DailyTraffic from 'components/admin/default/DailyTraffic';
import TaskCard from 'components/admin/default/TaskCard';
import tableDataCheck from 'variables/data-tables/tableDataCheck';
import tableDataComplex from 'variables/data-tables/tableDataComplex';

import { getUsers } from '../../lib/apiRequest';
import { Suspense, useEffect, useState } from 'react';
import Loading from 'app/loading';

const Dashboard = () => {
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const users = async () => {
      setIsloading(true);
      const { data, status } = await getUsers();
      setTimeout(() => {
        setIsloading(false);
      }, 3000);
      console.log(data, status);
    };
    users();
  }, []);

  return (
    <div>
      {/* Card widget */}
      <Suspense fallback={<Loading />}>
        <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
          <Widget
            icon={<MdBarChart className="h-7 w-7" />}
            title={'Earnings'}
            subtitle={'$340.5'}
          />
          <Widget
            icon={<IoDocuments className="h-6 w-6" />}
            title={'Spend this month'}
            subtitle={'$642.39'}
          />
          <Widget
            icon={<MdBarChart className="h-7 w-7" />}
            title={'Sales'}
            subtitle={'$574.34'}
          />
          <Widget
            icon={<MdDashboard className="h-6 w-6" />}
            title={'Your Balance'}
            subtitle={'$1,000'}
          />
          <Widget
            icon={<MdBarChart className="h-7 w-7" />}
            title={'New Tasks'}
            subtitle={'145'}
          />
          <Widget
            icon={<IoMdHome className="h-6 w-6" />}
            title={'Total Projects'}
            subtitle={'$2433'}
          />
        </div>
        {isLoading}
        {/* Charts */}

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <TotalSpent />
          <WeeklyRevenue />
        </div>

        {/* Tables & Charts */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Check Table */}
          <div>
            <CheckTable tableData={tableDataCheck} />
          </div>

          {/* Traffic chart & Pie Chart */}

          <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
            <DailyTraffic />
            <PieChartCard />
          </div>

          {/* Complex Table , Task & Calendar */}

          <ComplexTable tableData={tableDataComplex} />

          {/* Task chart & Calendar */}

          <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
            <TaskCard />
            <div className="grid grid-cols-1 rounded-[20px]">
              <MiniCalendar />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Dashboard;
