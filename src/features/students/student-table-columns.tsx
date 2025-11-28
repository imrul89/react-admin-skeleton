import { Link } from 'react-router-dom';
import { TableProps, Tag, Typography, Avatar } from 'antd';
import TypographyWrapper from '@components/shared/typography-wrapper';
import StudentTableColumnActions from '@features/students/student-table-column-actions';
import { Student } from '@models/student-model';
import { getShiftName } from '@utils/helpers';

const columns: TableProps<Student>['columns'] = [
  {
    title: 'Name',
    dataIndex: ['studentDetails', 'name'],
    key: 'name',
    render: (_, record) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link to={`/students/${record.id}`}>
          <Avatar
            src={`${__IMAGE_BASE_URL__}/uploads/students/${record.studentDetails?.photo}`}
            alt={record.studentDetails?.name}
            shape="circle"
            size={50}
          />
        </Link>
        <div>
          <Link to={`/students/${record.id}`}>
            {record.studentDetails?.name}
          </Link>
          <Typography.Text type="secondary" copyable style={{display: 'flex', fontSize: 12}}>
            {record.studentDetails?.student_no}
          </Typography.Text>
        </div>
      </div>
    )
  },
  {
    title: 'Class',
    dataIndex: ['class', 'name'],
    key: 'class',
    width: 180,
    render: (_, record) => (
      <div>
        <TypographyWrapper type="text">
          {record.class?.title}
        </TypographyWrapper>
        {record.section?.title && (
          <Typography.Text type="secondary" style={{ display: 'flex', fontSize: 12 }}>
            {record.section.title}
          </Typography.Text>
        )}
      </div>
    )
  },
  {
    title: 'Roll',
    dataIndex: 'roll',
    width: 100,
    key: 'roll',
    align: 'center',
    sorter: true,
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.roll || '-'}
      </TypographyWrapper>
    )
  },
  {
    title: 'Shift',
    dataIndex: 'shift_id',
    width: 100,
    key: 'shift',
    align: 'center',
    render: (_, record) => {
      return (
        <TypographyWrapper type="text">
          {getShiftName(record?.shift_id)}
        </TypographyWrapper>
      );
    }
  },
  {
    title: 'Mobile',
    dataIndex: ['studentDetails', 'mobile_no'],
    width: 150,
    key: 'mobile_no',
    align: 'center',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.studentDetails?.mobile_no || '-'}
      </TypographyWrapper>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status_id',
    key: 'status',
    width: 100,
    align: 'center',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.status_id === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
      </TypographyWrapper>
    )
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    align: 'center',
    width: 80,
    render: (_, record) => <StudentTableColumnActions student={record as Student} />
  }
];

export { columns };
