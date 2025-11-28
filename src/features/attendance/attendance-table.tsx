import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Row,
  Col,
  Select,
  DatePicker,
  App,
  Modal,
  Form
} from 'antd';
import Search from 'antd/es/input/Search';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import { useAttendances } from '@hooks/use-attendance';
import { useClassOptions } from '@hooks/use-school-classes';
import useFilter from '@hooks/utility-hooks/use-filter';
import { useUpdateAttendanceMutation } from '@services/attendance-service';
import { ATTENDANCE_FOR, SHIFT_OPTIONS } from '@utils/constants';
import { attendanceTableColumns } from './attendance-table-columns';

const { RangePicker } = DatePicker;

const ATTENDANCE_STATUS = [
  { value: 1, label: 'Present' },
  { value: 0, label: 'Absent' }
];

interface FilterFormValues {
  class_id?: number;
  shift_id?: number;
  status?: number;
  attendance_for?: number;
  date_range?: [Dayjs, Dayjs];
}

const AttendanceTable = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const { message } = App.useApp();
  const { getQueryParams, setQueryParams } = useFilter();
  const [search, setSearch] = useState<string>('');

  const { isLoading, data } = useAttendances();
  const { isClassOptionLoading, classOptions } = useClassOptions();
  const [updateAttendance, { isLoading: isUpdating }] = useUpdateAttendanceMutation();

  const queryParams = getQueryParams();

  const handleValuesChange = (changedValues: Partial<FilterFormValues>) => {
    const [fieldName] = Object.keys(changedValues) as (keyof FilterFormValues)[];
    let fieldValue = changedValues[fieldName];

    const params: any = { ...getQueryParams() };

    // Handle date range separately
    if (fieldName === 'date_range') {
      const dateRange = fieldValue as [Dayjs, Dayjs] | null | undefined;
      if (dateRange && dateRange[0] && dateRange[1]) {
      params.start_date = dateRange[0].format('YYYY-MM-DD');
      params.end_date = dateRange[1].format('YYYY-MM-DD');
      } else {
        delete params.start_date;
        delete params.end_date;
      }
    } else {
      // Handle other fields
      if (fieldValue !== undefined && fieldValue !== null) {
        params[fieldName] = fieldValue;
      } else {
        delete params[fieldName];
      }
    }

    // Reset to first page when filtering
    params.offset = 0;

    setQueryParams(params);
  };

  const onSearchHandle = (value: string) => {
    const params: any = { ...getQueryParams() };
    
    if (value) {
      params.search = value;
    } else {
      delete params.search;
    }
    
    params.offset = 0;
    setQueryParams(params);
  };

  useEffect(() => {
    const initialValues: FilterFormValues = {
      class_id: queryParams.class_id ? Number(queryParams.class_id) : undefined,
      shift_id: queryParams.shift_id ? Number(queryParams.shift_id) : undefined,
      status: queryParams.status !== undefined ? Number(queryParams.status) : undefined,
      attendance_for: queryParams.attendance_for ? Number(queryParams.attendance_for) : undefined,
    };

    if (queryParams.start_date && queryParams.end_date) {
      initialValues.date_range = [
        dayjs(queryParams.start_date as string),
        dayjs(queryParams.end_date as string)
      ];
    }

    form.setFieldsValue(initialValues);

    // Initialize search form with current search value
    if (queryParams.search) {
      setSearch(queryParams.search as string);
      searchForm.setFieldsValue({ search: queryParams.search });
    }
  }, []);

  const handleToggleStatus = (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? 'Present' : 'Absent';
    const currentStatusText = currentStatus === 1 ? 'Present' : 'Absent';
    
    // Find the attendance record to get student details
    const attendance = data?.attendances.find(a => a.id === id);
    const studentName = attendance?.student?.studentDetails?.name || 'this student';
    
    Modal.confirm({
      title: 'Confirm Status Change',
      content: (
        <div>
          <p>Are you sure you want to change the attendance status?</p>
          <p><strong>Student:</strong> {studentName}</p>
          <p><strong>Current Status:</strong> <span style={{ color: currentStatus === 1 ? '#52c41a' : '#ff4d4f' }}>{currentStatusText}</span></p>
          <p><strong>New Status:</strong> <span style={{ color: newStatus === 1 ? '#52c41a' : '#ff4d4f' }}>{statusText}</span></p>
        </div>
      ),
      okText: 'Yes, Change',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await updateAttendance({ id, status: newStatus }).unwrap();
          message.success(`Attendance updated to ${statusText}`);
        } catch (error: any) {
          message.error(error?.data?.message || 'Failed to update attendance');
        }
      }
    });
  };

  const columns = attendanceTableColumns(handleToggleStatus, isUpdating);

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
                label="Shift"
                name="shift_id"
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
                name="status"
              >
                <Select
                  placeholder="Select status"
                  allowClear
                  style={{ width: '100%' }}
                  options={ATTENDANCE_STATUS}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Type"
                name="attendance_for"
              >
                <Select
                  placeholder="Select type"
                  allowClear
                  style={{ width: '100%' }}
                  options={ATTENDANCE_FOR}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Date Range"
                name="date_range"
                className="!mb-1"
              >
                <RangePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  placeholder={['Start Date', 'End Date']}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card 
        title="Attendance Records"
        extra={(
          <div className="my-4">
            <Form form={searchForm} layout="inline">
              <Form.Item name="search" className="!mr-0">
                <Search
                  placeholder="Search by name, student no or roll"
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
      <Table
        columns={columns}
        dataSource={data?.attendances || []}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

        <div className="flex justify-end mt-4">
          <PaginationWrapper totalItems={data?.totalNumberOfRows || 0} />
        </div>
    </Card>
    </>
  );
};

export default AttendanceTable;

