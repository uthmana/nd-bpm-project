'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const LineChart = (props) => {
  const { chartData, chartOptions } = props;
  return (
    <Chart
      options={chartOptions}
      type="line"
      width="100%"
      height="100%"
      series={chartData}
    />
  );
};

export default LineChart;
