import { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Spin, Select, Calendar } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { Student } from '@models/student-model';
import { useStudentAttendanceSummaryQuery } from '@services/attendance-service';
import { MONTHS } from '@utils/constants';

interface StudentAttendanceTabProps {
  student: Student;
}

const StudentAttendanceTab = ({ student }: StudentAttendanceTabProps) => {
  const currentMonth = dayjs().month() + 1; // 1-12
  const currentYear = dayjs().year();
  
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Calculate start and end dates for selected month
  const monthStart = dayjs(`${selectedYear}-${selectedMonth}-01`).startOf('month');
  const monthEnd = dayjs(`${selectedYear}-${selectedMonth}-01`).endOf('month');

  const params = useMemo(() => ({
    start_date: monthStart.format('YYYY-MM-DD'),
    end_date: monthEnd.format('YYYY-MM-DD')
  }), [selectedMonth, selectedYear]);

  const { data: summaryData, isLoading, isFetching } = useStudentAttendanceSummaryQuery(
    { id: student.id, params },
    { skip: !student.id }
  );

  const attendancePercentage = useMemo(() => {
    if (!summaryData?.summary) return 0;
    return parseFloat(summaryData.summary.attendance_percentage || '0');
  }, [summaryData]);

  // Create a map of attendance by date for calendar rendering
  const attendanceMap = useMemo(() => {
    const map = new Map<string, number>();
    if (summaryData?.attendances) {
      summaryData.attendances.forEach(attendance => {
        const dateKey = dayjs(attendance.date).format('YYYY-MM-DD');
        map.set(dateKey, attendance.status);
      });
    }
    return map;
  }, [summaryData]);

  // Generate month options for dropdown
  const monthOptions = MONTHS.map(month => ({
    value: month.value,
    label: month.label
  }));

  // Generate year options (current year and previous 2 years)
  const yearOptions = Array.from({ length: 3 }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: year.toString() };
  });

  // Calendar cell renderer
  const dateCellRender = (value: Dayjs) => {
    const dateKey = value.format('YYYY-MM-DD');
    const status = attendanceMap.get(dateKey);
    
    if (status === undefined) {
      return null; // No attendance record for this date
    }

    return (
      <div className="text-center pt-3">
        {status === 1 ? (
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '32px' }} />
        ) : (
          <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '32px' }} />
        )}
      </div>
    );
  };

  const onPanelChange = (value: Dayjs) => {
    setSelectedMonth(value.month() + 1);
    setSelectedYear(value.year());
  };

  return (
    <div className="space-y-6">
      {/* Month and Year Selectors */}
      <Card>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Month</label>
              <Select
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={monthOptions}
                style={{ width: '100%' }}
                placeholder="Select Month"
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Year</label>
              <Select
                value={selectedYear}
                onChange={setSelectedYear}
                options={yearOptions}
                style={{ width: '100%' }}
                placeholder="Select Year"
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Attendance Summary */}
      <Spin spinning={isLoading || isFetching}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Days"
                value={summaryData?.summary?.total_days || 0}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Present Days"
                value={summaryData?.summary?.present_days || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Absent Days"
                value={summaryData?.summary?.absent_days || 0}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Attendance %"
                value={attendancePercentage}
                suffix="%"
                precision={2}
                valueStyle={{
                  color: attendancePercentage >= 80 ? '#52c41a' :
                         attendancePercentage >= 60 ? '#faad14' : '#ff4d4f'
                }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* Calendar */}
      <Card title="Attendance Calendar">
        <Spin spinning={isLoading || isFetching}>
          <Calendar
            value={dayjs()}
            dateCellRender={dateCellRender}
            onPanelChange={onPanelChange}
          />
          <div className="mt-4 flex gap-4 justify-center">
            <div className="flex items-center gap-2">
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
              <span className="text-sm">Absent</span>
            </div>
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default StudentAttendanceTab;
