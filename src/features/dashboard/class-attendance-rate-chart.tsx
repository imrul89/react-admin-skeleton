import { Card } from 'antd';
import Chart from 'react-apexcharts';
import { DashboardStats } from '@models/dashboard-model';

interface ClassAttendanceRateChartProps {
  classWiseAttendanceRate: DashboardStats['class_wise_attendance_rate'];
}

const ClassAttendanceRateChart = ({ classWiseAttendanceRate }: ClassAttendanceRateChartProps) => {
  const options = {
    chart: {
      id: 'class-attendance-rate-chart',
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: classWiseAttendanceRate.map(item => item.class_name)
    },
    yaxis: {
      title: {
        text: 'Attendance Rate (%)'
      },
      min: 0,
      max: 100
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`
    },
    colors: ['#52c41a'],
    title: {
      text: 'Class-wise Attendance Rate',
      align: 'left' as const
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    }
  };

  const series = [
    {
      name: 'Attendance Rate',
      data: classWiseAttendanceRate.map(item => item.attendance_rate)
    }
  ];

  return (
    <Card>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </Card>
  );
};

export default ClassAttendanceRateChart;

