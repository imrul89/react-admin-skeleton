import { Col, Flex, Row, Skeleton, Table } from 'antd';

const TableSkeleton = ({ className }: { className?: string }) => {
  const tableData = new Array(6).fill(1).map((_, i) => ({ key: i, first: i }));
  
  const columns = [
    {
      title: (
        <Flex gap={16}>
          <Skeleton.Avatar active size="small" />
          <Skeleton.Button active size="small" />
        </Flex>
      ),
      dataIndex: 'first',
      width: '32%',
      render: () => (
        <Flex gap={16}>
          <Skeleton.Avatar active size="small" />
          <Skeleton.Input active size="small" block={true} />
        </Flex>
      ),
    },
    {
      title: <Skeleton.Input active size="small" />,
      dataIndex: 'second',
      width: '17%',
      render: () => <Skeleton.Input active size="small" block={true} />
    },
    {
      title: <Skeleton.Input active size="small" />,
      dataIndex: 'third',
      width: '17%',
      render: () => (
        <Flex gap={16}>
          <Skeleton.Button active size="small" /> -
          <Skeleton.Button active size="small" />
        </Flex>
      ),
    },
    {
      title: <Skeleton.Button active size="small" />,
      dataIndex: 'fourth',
      width: '17%',
      render: () => (
        <Flex justify="center">
          <Skeleton.Button active size="small" shape="round" />
        </Flex>
      )
    },
    {
      title: <Skeleton.Button active size="small" />,
      dataIndex: 'fifth',
      width: '17%',
      render: () => (
        <Flex gap={16}>
          <Skeleton.Avatar active size="small" shape="circle" />
          <Skeleton.Button active size="small" />
        </Flex>
      ),
    },
    {
      title: <Skeleton.Button active size="small" />,
      dataIndex: 'sixth',
      width: 80,
      render: () => (
        <Flex justify="center">
          <Skeleton.Avatar active size="small" shape="circle" />
        </Flex>
      )
    }
  ];
  return (
    <div className={className}>
      {tableData && (
        <Table
          sticky
          className="h-[350px)]"
          pagination={false}
          columns={columns}
          dataSource={tableData}
        />
      )}
      
      <Row className="mt-4">
        <Col span={12}></Col>
        <Col span={12}>
          <Flex gap={16}>
            <Skeleton.Input active size="small" block />
            <Skeleton.Input active size="small" block />
            <Skeleton.Input active size="small" block />
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default TableSkeleton;