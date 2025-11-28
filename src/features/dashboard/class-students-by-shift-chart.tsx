import { Card } from 'antd';
import Chart from 'react-apexcharts';
import { DashboardStats } from '@models/dashboard-model';

interface ClassStudentsByShiftChartProps {
  classWiseStudentsByShift: DashboardStats['class_wise_students_by_shift'];
}

const ClassStudentsByShiftChart = ({ classWiseStudentsByShift }: ClassStudentsByShiftChartProps) => {
  const options = {
    chart: {
      id: 'class-students-by-shift-chart',
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: classWiseStudentsByShift.map(item => item.class_name)
    },
    yaxis: {
      title: {
        text: 'Number of Students'
      }
    },
    dataLabels: {
      enabled: true
    },
    colors: ['#1890ff', '#52c41a'],
    legend: {
      position: 'top' as const
    },
    title: {
      text: 'Class-wise Students by Shift',
      align: 'left' as const
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} students`
      }
    }
  };

  const series = [
    {
      name: 'Morning',
      data: classWiseStudentsByShift.map(item => item.morning)
    },
    {
      name: 'Day',
      data: classWiseStudentsByShift.map(item => item.day)
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

export default ClassStudentsByShiftChart;

