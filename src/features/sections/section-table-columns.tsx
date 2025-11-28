import { Link } from 'react-router-dom';
import { MenuProps, Dropdown, Button, TableProps } from 'antd';
import { MoreOutlined, EditOutlined } from '@ant-design/icons';
import TypographyWrapper from '@components/shared/typography-wrapper';
import { Section } from '@models/section-model';

const getActions = (record: Section): MenuProps['items'] => {
  return [
    {
      key: `edit-${record.id}`,
      label: <Link to={`/sections/${record.id}`}>
        <EditOutlined /> Edit
      </Link>
    }
  ];
};

const columns: TableProps<Section>['columns'] = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.title}
      </TypographyWrapper>
    )
  },
  {
    title: 'Class',
    dataIndex: ['class', 'title'],
    key: 'class',
    sorter: true,
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.class?.title || 'N/A'}
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
      <Dropdown
        key={`action-${record.id}`}
        menu={{ items: getActions(record) }}
        trigger={['click']}
        overlayClassName="grid-action"
      >
        <Button shape="circle" icon={<MoreOutlined />} />
      </Dropdown>
    )
  }
];

export { columns };
