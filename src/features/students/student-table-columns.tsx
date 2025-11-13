import { Link } from 'react-router-dom';
import { TableProps, Tag, Typography, Avatar } from 'antd';
import TypographyWrapper from '@components/shared/typography-wrapper';
import StudentTableColumnActions from '@features/students/student-table-column-actions';
import { Student } from '@models/student-model';

const columns: TableProps<Student>['columns'] = [
  {
    title: 'Name',
    dataIndex: ['studentDetails', 'name'],
    key: 'name',
    width: 120,
    fixed: 'left',
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
    width: 100,
    key: 'class',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.class?.title}
      </TypographyWrapper>
    )
  },
  {
    title: 'Roll',
    dataIndex: 'roll',
    width: 50,
    key: 'roll',
    align: 'center',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.roll || '-'}
      </TypographyWrapper>
    )
  },
  {
    title: 'Gender',
    dataIndex: ['studentDetails', 'gender'],
    width: 70,
    key: 'gender',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.studentDetails?.gender || '-'}
      </TypographyWrapper>
    )
  },
  {
    title: 'Mobile',
    dataIndex: ['studentDetails', 'mobile_no'],
    width: 100,
    key: 'mobile_no',
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
    width: 70,
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
    width: 40,
    render: (_, record) => <StudentTableColumnActions student={record as Student} />
  }
];

export { columns };
