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
import { log } from 'utils';

const Dashboard = () => {
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const users = async () => {
      setIsloading(true);
      const { data, status } = await getUsers();
      setTimeout(() => {
        setIsloading(false);
      }, 3000);
      log(data, status);
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
            title={'Günün Ürün Girişi'}
            subtitle={'$340.5'}
          />
          <Widget
            icon={<IoDocuments className="h-6 w-6" />}
            title={'Aylık Process'}
            subtitle={'642'}
          />
          <Widget
            icon={<MdBarChart className="h-7 w-7" />}
            title={'Toplam Irsaliye'}
            subtitle={'574'}
          />
          <Widget
            icon={<MdDashboard className="h-6 w-6" />}
            title={'Kontrol Bekleyen'}
            subtitle={'1,000'}
          />
          <Widget
            icon={<MdBarChart className="h-7 w-7" />}
            title={'Toplam İrsaliye'}
            subtitle={'145'}
          />
          <Widget
            icon={<IoMdHome className="h-6 w-6" />}
            title={'Gönderilen Teklifler'}
            subtitle={'2433'}
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
              <MiniCalendar className="p-4 dark:!bg-[#111c44]" />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Dashboard;
