'use client';
import MiniCalendar from 'components/calendar/MiniCalendar';
import WeeklyRevenue from 'components/weeklyRevenue';
import TotalSpent from 'components/totalSpent';
import {
  MdGroupWork,
  MdLocalOffer,
  MdOutlineBusiness,
  MdOutlineGroups3,
  MdOutlineMultilineChart,
  MdTaskAlt,
} from 'react-icons/md';

import Widget from 'components/widget/Widget';
import MiniTable from 'components/admin/data-tables/miniTable';
import { getDashboard } from '../../lib/apiRequest';
import { useEffect, useState } from 'react';
import {
  log,
  getMonthlySum,
  getMonthAndWeekDates,
  convertToISO8601,
  formatNumberLocale,
} from 'utils';
import { NewDashboardSkeleton } from 'components/skeleton';

const Dashboard = () => {
  const [widgetData, setWidgetData] = useState({} as any);
  const [monthlyInvoice, setMonthlyInvoice] = useState([]);
  const [monthlyProcess, setMonthlyProcess] = useState([] as any);
  const [recentProcess, setRecentProcess] = useState([]);
  const [recentCustomer, setRecentCustomer] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { startOfMonth, endOfMonth } = getMonthAndWeekDates();
      setLoading(true);
      const { data, status } = await getDashboard({
        startOfMonth: convertToISO8601(startOfMonth),
        endOfMonth: convertToISO8601(endOfMonth),
      });
      if (status === 200) {
        setWidgetData(data?.widget);

        const monthlyEntry = {
          process: getMonthlySum(data?.monthlyEntry?.process, 'createdAt'),
          invoice: getMonthlySum(data?.monthlyEntry?.invoice, 'createdAt'),
        };
        setMonthlyProcess([
          {
            name: 'Process',
            data: monthlyEntry?.process,
            color: '#4318FF',
            total: monthlyEntry?.process.reduce((a, b) => b + a, 0),
          },
        ]);
        setMonthlyInvoice([
          {
            name: 'invoice',
            data: monthlyEntry?.invoice,
            color: '#6AD2Fa',
          },
        ]);
        setRecentProcess(data?.recentProcess);
        setRecentCustomer(data?.recentCustomer);
        setLoading(false);
        return;
      }
      log(data, status);
    };
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <NewDashboardSkeleton nav={false} />
      ) : (
        <div className="w-full">
          <div className="mt-3 grid grid-cols-1 gap-5  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
            <Widget
              icon={<MdOutlineGroups3 className="h-7 w-7" />}
              title={'Müşteri Sayısı'}
              subtitle={formatNumberLocale(widgetData?.customer)}
            />
            <Widget
              icon={<MdOutlineMultilineChart className="h-6 w-6" />}
              title={'Stok Sayısı'}
              subtitle={formatNumberLocale(widgetData?.stock)}
            />
            <Widget
              icon={<MdOutlineBusiness className="h-7 w-7" />}
              title={'Aylık Ürün Girişi'}
              subtitle={formatNumberLocale(widgetData?.entry)}
            />
            <Widget
              icon={<MdGroupWork className="h-6 w-6" />}
              title={'Aylık Proses'}
              subtitle={formatNumberLocale(widgetData?.process)}
            />
            <Widget
              icon={<MdTaskAlt className="h-7 w-7" />}
              title={'Toplam İrsaliye'}
              subtitle={formatNumberLocale(widgetData?.invoice)}
            />
            <Widget
              icon={<MdLocalOffer className="h-6 w-6" />}
              title={'Gönderilen Teklifler'}
              subtitle={formatNumberLocale(widgetData?.offer)}
            />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <TotalSpent chartData={monthlyProcess} />
            <WeeklyRevenue chartData={monthlyInvoice} />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5">
            <MiniTable
              variant="process"
              title="Procesler"
              tableData={recentProcess}
              key={recentProcess.length}
            />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="col-span-2">
              <MiniTable
                variant="customer"
                title="Son Eklenen Müşteriler"
                tableData={recentCustomer}
                key={recentCustomer.length}
              />
            </div>
            <MiniCalendar className="p-4 dark:!bg-[#111c44]" />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
