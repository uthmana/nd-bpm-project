'use client';
import MiniCalendar from 'components/calendar/MiniCalendar';
import WeeklyRevenue from 'components/admin/default/WeeklyRevenue';
import TotalSpent from 'components/admin/default/TotalSpent';
import PieChartCard from 'components/admin/default/PieChartCard';
import {
  MdGroupWork,
  MdLocalOffer,
  MdOutlineBusiness,
  MdOutlineGroups3,
  MdOutlineMultilineChart,
  MdTaskAlt,
} from 'react-icons/md';

import Widget from 'components/widget/Widget';
import CheckTable from 'components/admin/default/CheckTable';
import ComplexTable from 'components/admin/default/ComplexTable';
import DailyTraffic from 'components/admin/default/DailyTraffic';
import TaskCard from 'components/admin/default/TaskCard';
import tableDataCheck from 'variables/data-tables/tableDataCheck';
import tableDataComplex from 'variables/data-tables/tableDataComplex';

import { getDashboard } from '../../lib/apiRequest';
import { Suspense, useEffect, useState } from 'react';
import Loading from 'app/loading';
import { log } from 'utils';

const Dashboard = () => {
  const [isLoading, setIsloading] = useState(true);
  const [widgetData, setWidgetData] = useState({} as any);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      const { data, status } = await getDashboard();
      if (status === 200) {
        setWidgetData(data?.widget);
        setWeeklyData(data?.weeklyEntry);
        setMonthlyData(data?.monthlyEntry);
        setIsloading(false);
        return;
      }
      log(data, status);
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Card widget */}
      <Suspense fallback={<Loading />}>
        <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
          <Widget
            icon={<MdOutlineGroups3 className="h-7 w-7" />}
            title={'Müşteri Sayısı'}
            subtitle={widgetData?.customer}
          />
          <Widget
            icon={<MdOutlineMultilineChart className="h-6 w-6" />}
            title={'Stok Sayısı'}
            subtitle={widgetData?.stock}
          />
          <Widget
            icon={<MdOutlineBusiness className="h-7 w-7" />}
            title={'Aylık Ürün Girişi'}
            subtitle={widgetData?.entry}
          />
          <Widget
            icon={<MdGroupWork className="h-6 w-6" />}
            title={'Aylık Proses'}
            subtitle={widgetData?.process}
          />
          <Widget
            icon={<MdTaskAlt className="h-7 w-7" />}
            title={'Toplam İrsaliye'}
            subtitle={widgetData?.invoice}
          />
          <Widget
            icon={<MdLocalOffer className="h-6 w-6" />}
            title={'Gönderilen Teklifler'}
            subtitle={widgetData?.offer}
          />
        </div>

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
