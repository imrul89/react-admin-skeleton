import Search from 'antd/es/input/Search';
import { useEffect, useState } from 'react';
import { Table, Card, Form, Row, Col, Select } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import { useClassOptions } from '@hooks/use-school-classes';
import { useSectionOptions } from '@hooks/use-sections';
import { useStudents } from '@hooks/use-students';
import useFilter from '@hooks/utility-hooks/use-filter';
import { SHIFT_OPTIONS } from '@utils/constants';
import { columns } from './student-table-columns';

const STUDENT_STATUS = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'Inactive' }
];

interface FilterFormValues {
  class_id?: number;
  section_id?: number;
  shift_id?: number;
  status_id?: number;
}

const StudentTable = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const { getQueryParams, setQueryParams, sortTableColumn } = useFilter();
  
  const { isLoading, data } = useStudents();
  const { isClassOptionLoading, classOptions } = useClassOptions();
  const selectedClassId = Form.useWatch('class_id', form);
  const { isSectionOptionLoading, sectionOptions } = useSectionOptions(selectedClassId);

  const queryParams = getQueryParams();
  const [search, setSearch] = useState(getQueryParams().search as string);

  const handleValuesChange = (changedValues: Partial<FilterFormValues>) => {
    const [fieldName] = Object.keys(changedValues) as (keyof FilterFormValues)[];
    const fieldValue = changedValues[fieldName];

    const params: any = { ...getQueryParams() };

    // Handle field value
    if (fieldValue !== undefined && fieldValue !== null) {
      params[fieldName] = fieldValue;
    } else {
      delete params[fieldName];
    }

    // If class_id is cleared, also remove section_id from URL
    if (fieldName === 'class_id' && (fieldValue === undefined || fieldValue === null)) {
      delete params.section_id;
      form.setFieldsValue({ section_id: undefined });
    }

    // Reset to first page when filtering
    params.offset = 0;

    setQueryParams(params);
  };

  const onSearchHandle = (value: string) => {
    setQueryParams({
      ...getQueryParams(),
      search: value,
      offset: 0
    });
  };

  useEffect(() => {
    const initialValues: FilterFormValues = {
      class_id: queryParams.class_id ? Number(queryParams.class_id) : undefined,
      section_id: queryParams.section_id ? Number(queryParams.section_id) : undefined,
      shift_id: queryParams.shift_id ? Number(queryParams.shift_id) : undefined,
      status_id: queryParams.status_id ? Number(queryParams.status_id) : undefined,
    };

    form.setFieldsValue(initialValues);
    searchForm.setFieldsValue({ search: queryParams.search });
  }, []);

  // Reset section when class changes
  useEffect(() => {
    if (!selectedClassId) {
      form.setFieldsValue({ section_id: undefined });
    }
  }, [selectedClassId]);
  
  return (
    <>
      <Card title="Filters" className="!mb-4">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label="Class"
                name="class_id"
                className="!mb-1"
              >
                <Select
                  placeholder="Select class"
                  allowClear
                  style={{ width: '100%' }}
                  loading={isClassOptionLoading}
                  options={classOptions}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Section"
                name="section_id"
                className="!mb-1"
              >
                <Select
                  placeholder="Select section"
                  allowClear
                  style={{ width: '100%' }}
                  loading={isSectionOptionLoading}
                  options={sectionOptions}
                  disabled={!selectedClassId}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Shift"
                name="shift_id"
                className="!mb-1"
              >
                <Select
                  placeholder="Select shift"
                  allowClear
                  style={{ width: '100%' }}
                  options={SHIFT_OPTIONS}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Status"
                name="status_id"
                className="!mb-1"
              >
                <Select
                  placeholder="Select status"
                  allowClear
                  style={{ width: '100%' }}
                  options={STUDENT_STATUS}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      
      <Card
        title="Students"
        extra={(
          <div className="my-4">
            <Form form={searchForm} layout="inline">
              
              <Form.Item name="search" className="!mr-0">
                <Search
                  placeholder="Search by name, student no, roll or mobile no"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onSearch={onSearchHandle}
                  allowClear
                  style={{ width: 350 }}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      >
        {data?.students ? (
          <>
            <Table
              columns={columns}
              dataSource={data?.students}
              loading={isLoading}
              pagination={false}
              onChange={sortTableColumn}
              rowKey="id"
              sticky={{ offsetHeader: 64 }}
            />
            <div className="flex justify-end mt-4">
              <PaginationWrapper totalItems={data?.totalNumberOfRows || 0} />
            </div>
          </>
        ) : (
          <TableSkeleton />
        )}
      </Card>
    </>
  );
};

export default StudentTable;
