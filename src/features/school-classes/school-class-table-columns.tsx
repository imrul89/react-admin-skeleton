import { Button, TableProps, Tag } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import TypographyWrapper from '@components/shared/typography-wrapper';
import { SchoolClass } from '@models/school-class-model';
import { getMonths } from '@utils/helpers';

interface ColumnsProps {
  onConfigClick: (record: SchoolClass) => void;
}

const getColumns = ({ onConfigClick }: ColumnsProps): TableProps<SchoolClass>['columns'] => [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: 200,
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.title}
      </TypographyWrapper>
    )
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    sorter: true,
    width: 120,
    align: 'center',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.code}
      </TypographyWrapper>
    )
  },
  {
    title: 'Serial',
    dataIndex: 'serial',
    key: 'serial',
    sorter: true,
    width: 120,
    align: 'center',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.serial}
      </TypographyWrapper>
    )
  },
  {
    title: 'Coaching Applicable on Months',
    dataIndex: 'coaching_applicable',
    key: 'coaching_applicable',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {getMonths(record.coaching_applicable)?.map(month => (
          <Tag className="!my-1">{month}</Tag>
        ))}
      </TypographyWrapper>
    )
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    align: 'center',
    width: 100,
    render: (_, record) => (
      <Button 
        shape="circle" 
        icon={<SettingOutlined />}
        onClick={() => onConfigClick(record)}
        title="Configure"
      />
    )
  }
];

export { getColumns };
