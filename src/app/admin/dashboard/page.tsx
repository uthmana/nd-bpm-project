import MiniCalendar from 'components/calendar/MiniCalendar';
import WeeklyRevenue from 'components/admin/default/WeeklyRevenue';
import TotalSpent from 'components/admin/default/TotalSpent';
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
import { Suspense } from 'react';
import { NewDashboardSkeleton } from 'components/skeleton';

export const dynamic = 'force-dynamic';

const getDashboradData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/api/dashboard`,
      { next: { revalidate: 0 } },
    );
    if (!res.ok) {
      console.log(res.statusText, { res });
    }
    const resData = await res.json();
    return resData;
  } catch (err) {
    console.log({ err });
  }
};

const Dashboard = async () => {
  const resData = await getDashboradData();

  const processChart = (data) => {
    return [
      {
        name: 'Process',
        data: data?.monthlyEntry?.process,
        color: '#4318FF',
        total: data?.monthlyEntry?.process.reduce((a, b) => b + a, 0),
      },
    ];
  };

  const invoiceChart = (data) => {
    return [
      {
        name: 'invoice',
        data: data?.monthlyEntry?.invoice,
        color: '#6AD2Fa',
      },
    ];
  };

  return (
    <Suspense fallback={<NewDashboardSkeleton />}>
      <div className="w-full">
        <div className="mt-3 grid grid-cols-1 gap-5  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
          <Widget
            icon={<MdOutlineGroups3 className="h-7 w-7" />}
            title={'Müşteri Sayısı'}
            subtitle={resData?.widget?.customer}
          />
          <Widget
            icon={<MdOutlineMultilineChart className="h-6 w-6" />}
            title={'Stok Sayısı'}
            subtitle={resData?.widget?.stock}
          />
          <Widget
            icon={<MdOutlineBusiness className="h-7 w-7" />}
            title={'Aylık Ürün Girişi'}
            subtitle={resData?.widget?.entry}
          />
          <Widget
            icon={<MdGroupWork className="h-6 w-6" />}
            title={'Aylık Proses'}
            subtitle={resData?.widget?.process}
          />
          <Widget
            icon={<MdTaskAlt className="h-7 w-7" />}
            title={'Toplam İrsaliye'}
            subtitle={resData?.widget?.invoice}
          />
          <Widget
            icon={<MdLocalOffer className="h-6 w-6" />}
            title={'Gönderilen Teklifler'}
            subtitle={resData?.widget?.offer}
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <TotalSpent chartData={processChart(resData)} />
          <WeeklyRevenue chartData={invoiceChart(resData)} />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5">
          <MiniTable
            variant="process"
            title="Yeni Proces"
            tableData={resData?.recentProcess}
            key={resData?.recentProcess?.length}
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="col-span-2">
            <MiniTable
              variant="customer"
              title="Yeni Müşteri"
              tableData={resData?.recentCustomer}
              key={resData?.recentCustomer?.length}
            />
          </div>
          <MiniCalendar className="p-4 dark:!bg-[#111c44]" />
        </div>
      </div>
    </Suspense>
  );
};

export default Dashboard;
