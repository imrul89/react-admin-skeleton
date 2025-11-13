import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Spin, Empty } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CalendarOutlined, PercentageOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useClassOptions } from '@hooks/use-school-classes';
import { useAttendancesQuery } from '@services/attendance-service';
import { ATTENDANCE_FOR } from '@utils/constants';

const { RangePicker } = DatePicker;

const AttendanceSummaryCard = () => {
  const { isClassOptionLoading, classOptions } = useClassOptions();
  
  const [classId, setClassId] = useState<number | undefined>(undefined);
  const [attendanceFor, setAttendanceFor] = useState<number | undefined>(1); // Default: School
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);

  const params = {
    class_id: classId,
    attendance_for: attendanceFor,
    start_date: dateRange[0].format('YYYY-MM-DD'),
    end_date: dateRange[1].format('YYYY-MM-DD'),
    limit: 10000 // Get all records for summary
  };

  const { data, isLoading, isFetching } = useAttendancesQuery(params);

  const [summary, setSummary] = useState({
    totalRecords: 0,
    presentCount: 0,
    absentCount: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    if (data?.attendances) {
      const attendances = data.attendances;
      const totalRecords = attendances.length;
      const presentCount = attendances.filter(a => a.status === 1).length;
      const absentCount = attendances.filter(a => a.status === 0).length;
      const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(2) : '0.00';

      setSummary({
        totalRecords,
        presentCount,
        absentCount,
        attendanceRate: parseFloat(attendanceRate)
      });
    }
  }, [data]);

  return (
    <Card 
      title="Attendance Summary" 
      extra={
        <CalendarOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
      }
    >
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={8}>
          <Select
            placeholder="Select class (All)"
            allowClear
            style={{ width: '100%' }}
            loading={isClassOptionLoading}
            options={classOptions}
            value={classId}
            onChange={setClassId}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            placeholder="Select type"
            style={{ width: '100%' }}
            options={ATTENDANCE_FOR}
            value={attendanceFor}
            onChange={setAttendanceFor}
          />
        </Col>
        <Col xs={24} sm={8}>
          <RangePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            value={dateRange}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0], dates[1]]);
              }
            }}
          />
        </Col>
      </Row>

      <Spin spinning={isLoading || isFetching}>
        {summary.totalRecords > 0 ? (
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Records"
                  value={summary.totalRecords}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Present"
                  value={summary.presentCount}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Absent"
                  value={summary.absentCount}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Attendance Rate"
                  value={summary.attendanceRate}
                  prefix={<PercentageOutlined />}
                  suffix="%"
                  precision={2}
                  valueStyle={{ 
                    color: summary.attendanceRate >= 75 ? '#52c41a' : 
                           summary.attendanceRate >= 50 ? '#faad14' : '#ff4d4f' 
                  }}
                />
              </Card>
            </Col>
          </Row>
        ) : (
          <Empty 
            description="No attendance data found for the selected filters" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>
    </Card>
  );
};

export default AttendanceSummaryCard;

