import type { ColumnsType } from 'antd/es/table';
import { Tag, Button, Tooltip, Avatar, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { Attendance } from '@models/attendance-model';
import { ATTENDANCE_FOR } from '@utils/constants';
import { dateFormat } from '@utils/helpers';

export const attendanceTableColumns = (
  onToggleStatus: (id: number, currentStatus: number) => void,
  isLoading: boolean
): ColumnsType<Attendance> => [
  {
    title: 'Student',
    key: 'student',
    render: (_: any, record: Attendance) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar
          src={`${__IMAGE_BASE_URL__}/uploads/students/${record.student?.studentDetails?.photo}`}
          alt={record.student?.studentDetails?.name}
          shape="circle"
          size={50}
        />
        <div>
          <div>{record.student?.studentDetails?.name || 'N/A'}</div>
          <Typography.Text type="secondary" style={{ display: 'flex', fontSize: 12 }}>
            {record.student?.studentDetails?.student_no || 'N/A'}
          </Typography.Text>
        </div>
      </div>
    )
  },
  {
    title: 'Roll',
    key: 'roll',
    width: 80,
    align: 'center',
    render: (_: any, record: Attendance) => record.student?.roll || 'N/A'
  },
  {
    title: 'Class',
    key: 'class',
    width: 200,
    render: (_: any, record: Attendance) => record.student?.class?.title || 'N/A'
  },
  {
    title: 'Type',
    dataIndex: 'attendance_for',
    key: 'attendance_for',
    width: 120,
    render: (value: number) => {
      const type = ATTENDANCE_FOR.find(t => t.value === value);
      return <Tag color={value === 1 ? 'blue' : 'purple'}>{type?.label || 'N/A'}</Tag>;
    }
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    width: 120,
    render: (value: string) => dateFormat(value)
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    align: 'center',
    render: (value: number, record: Attendance) => (
      <Button
        size="small"
        type="link"
        onClick={() => onToggleStatus(record.id, value)}
        disabled={isLoading}
      >
        {value === 1 ? (
          <Tag color="green">Present</Tag>
        ) : (
          <Tag color="red">Absent</Tag>
        )}
      </Button>
    )
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 80,
    align: 'center',
    render: (_: any, record: Attendance) => (
      <Tooltip title="Toggle Status">
        <Button
          type="primary"
          size="small"
          icon={<SwapOutlined />}
          onClick={() => onToggleStatus(record.id, record.status)}
          loading={isLoading}
        />
      </Tooltip>
    )
  }
];

