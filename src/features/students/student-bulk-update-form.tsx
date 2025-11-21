import { useState, useMemo, useEffect } from 'react';
import {
  App,
  Card,
  Form,
  Row,
  Col,
  Button,
  Select,
  Table,
  InputNumber,
  Radio,
  Space,
  Typography,
  Empty,
  Spin
} from 'antd';
import { SaveOutlined, EditOutlined } from '@ant-design/icons';
import { useClassOptions } from '@hooks/use-school-classes';
import { useStudentsQuery, useBulkUpdateStudentsMutation } from '@services/students-service';
import { Student } from '@models/student-model';
import { BulkUpdateStudentItem, BulkUpdateStudentsRequest } from '@models/student-bulk-update-model';
import { SHIFT_OPTIONS, RELIGIONS, MONTHS } from '@utils/constants';
import { formatQueryParams } from '@utils/helpers';
import useFilter from '@hooks/utility-hooks/use-filter';

const { Text, Title } = Typography;

const StudentBulkUpdateForm = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { isClassOptionLoading, classOptions } = useClassOptions();
  const { getDefaultQueryParams } = useFilter();
  
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
  const [selectedShiftId, setSelectedShiftId] = useState<number | undefined>();
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [editedStudents, setEditedStudents] = useState<Map<number, Partial<BulkUpdateStudentItem & { coaching_off_months?: number[] }>>>(new Map());

  const [bulkUpdate, { isLoading: isUpdating }] = useBulkUpdateStudentsMutation();

  // Build query params for fetching students
  const queryParams = useMemo(() => {
    if (!selectedClassId || !selectedShiftId) return '';
    return formatQueryParams({
      class_id: selectedClassId,
      shift_id: selectedShiftId,
      limit: 1000,
      offset: 0
    });
  }, [selectedClassId, selectedShiftId]);

  const { data: studentsResponse, isLoading: isLoadingStudents, refetch } = useStudentsQuery(queryParams, {
    skip: !selectedClassId || !selectedShiftId || queryParams === ''
  });

  useEffect(() => {
    if (studentsResponse?.students) {
      setStudentsData(studentsResponse.students);
      // Initialize edited students map
      const initialMap = new Map<number, Partial<BulkUpdateStudentItem>>();
      studentsResponse.students.forEach(student => {
        initialMap.set(student.id, {
          student_id: student.id,
          roll: student.roll || undefined,
          gender: student.studentDetails?.gender,
          religion_id: student.studentDetails?.religion_id,
          shift_id: student.shift_id || undefined,
          coaching_off_months: student.coaching_off ? student.coaching_off.split(',').map(Number) : []
        });
      });
      setEditedStudents(initialMap);
    }
  }, [studentsResponse]);

  const handleClassChange = (classId: number | undefined) => {
    setSelectedClassId(classId);
    setSelectedShiftId(undefined);
    setStudentsData([]);
    setEditedStudents(new Map());
  };

  const handleShiftChange = (shiftId: number | undefined) => {
    setSelectedShiftId(shiftId);
    setStudentsData([]);
    setEditedStudents(new Map());
  };

  const handleFieldChange = (studentId: number, field: keyof BulkUpdateStudentItem | 'coaching_off_months', value: any) => {
    const updated = new Map(editedStudents);
    const current = updated.get(studentId) || { student_id: studentId };
    updated.set(studentId, { ...current, [field]: value });
    setEditedStudents(updated);
  };

  const handleSave = async () => {
    if (!selectedClassId || !selectedShiftId) {
      message.error('Please select both class and shift');
      return;
    }

    if (editedStudents.size === 0) {
      message.warning('No changes to save');
      return;
    }

    try {
      const studentsToUpdate: BulkUpdateStudentItem[] = Array.from(editedStudents.values())
        .filter(student => {
          // Only include students that have actual changes
          const original = studentsData.find(s => s.id === student.student_id);
          if (!original) return false;
          return (
            student.roll !== original.roll ||
            student.gender !== original.studentDetails?.gender ||
            student.religion_id !== original.studentDetails?.religion_id ||
            student.shift_id !== original.shift_id ||
            JSON.stringify(student.coaching_off || []) !== JSON.stringify(
              original.coaching_off ? original.coaching_off.split(',').map(Number) : []
            )
          );
        })
        .map(student => ({
          student_id: student.student_id!,
          roll: student.roll,
          gender: student.gender,
          religion_id: student.religion_id,
          shift_id: student.shift_id,
          coaching_off: (student as any).coaching_off_months && (student as any).coaching_off_months.length > 0 
            ? (student as any).coaching_off_months.join(',') 
            : null
        }));

      const requestData: BulkUpdateStudentsRequest = {
        class_id: selectedClassId,
        shift_id: selectedShiftId,
        students: studentsToUpdate
      };

      const response = await bulkUpdate(requestData).unwrap();
      message.success(response.message);
      refetch();
      setEditedStudents(new Map());
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to update students');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: ['studentDetails', 'name'],
      key: 'name',
      width: 150,
      fixed: 'left' as const,
      render: (_: any, record: Student) => (
        <div>
          <Text strong>{record.studentDetails?.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.studentDetails?.student_no}
          </Text>
        </div>
      )
    },
    {
      title: 'Roll',
      dataIndex: 'roll',
      key: 'roll',
      width: 100,
      render: (_: any, record: Student) => {
        const edited = editedStudents.get(record.id);
        return (
          <InputNumber
            value={edited?.roll !== undefined ? edited.roll : record.roll || undefined}
            onChange={(value) => handleFieldChange(record.id, 'roll', value || null)}
            min={1}
            style={{ width: '100%' }}
            placeholder="Roll"
          />
        );
      }
    },
    {
      title: 'Gender',
      dataIndex: ['studentDetails', 'gender'],
      key: 'gender',
      width: 120,
      render: (_: any, record: Student) => {
        const edited = editedStudents.get(record.id);
        const currentGender = edited?.gender !== undefined 
          ? edited.gender 
          : record.studentDetails?.gender;
        return (
          <Radio.Group
            value={currentGender}
            onChange={(e) => handleFieldChange(record.id, 'gender', e.target.value)}
            size="small"
          >
            <Radio.Button value="Male">Male</Radio.Button>
            <Radio.Button value="Female">Female</Radio.Button>
          </Radio.Group>
        );
      }
    },
    {
      title: 'Religion',
      dataIndex: ['studentDetails', 'religion_id'],
      key: 'religion',
      width: 150,
      render: (_: any, record: Student) => {
        const edited = editedStudents.get(record.id);
        const currentReligion = edited?.religion_id !== undefined 
          ? edited.religion_id 
          : record.studentDetails?.religion_id;
        return (
          <Select
            value={currentReligion}
            onChange={(value) => handleFieldChange(record.id, 'religion_id', value)}
            options={RELIGIONS}
            placeholder="Select Religion"
            style={{ width: '100%' }}
            allowClear
          />
        );
      }
    },
    {
      title: 'Shift',
      dataIndex: 'shift_id',
      key: 'shift',
      width: 120,
      render: (_: any, record: Student) => {
        const edited = editedStudents.get(record.id);
        const currentShift = edited?.shift_id !== undefined 
          ? edited.shift_id 
          : record.shift_id;
        return (
          <Select
            value={currentShift}
            onChange={(value) => handleFieldChange(record.id, 'shift_id', value || null)}
            options={SHIFT_OPTIONS}
            placeholder="Select Shift"
            style={{ width: '100%' }}
          />
        );
      }
    },
    {
      title: 'Coaching Off Months',
      dataIndex: 'coaching_off',
      key: 'coaching_off',
      width: 200,
      render: (_: any, record: Student) => {
        const edited = editedStudents.get(record.id);
        const currentMonths = edited?.coaching_off_months !== undefined 
          ? edited.coaching_off_months 
          : (record.coaching_off ? record.coaching_off.split(',').map(Number) : []);
        return (
          <Select
            mode="multiple"
            value={currentMonths}
            onChange={(value) => handleFieldChange(record.id, 'coaching_off_months', value)}
            options={MONTHS}
            placeholder="Select Months"
            style={{ width: '100%' }}
            allowClear
            maxTagCount={3}
          />
        );
      }
    }
  ];

  const hasChanges = editedStudents.size > 0 && Array.from(editedStudents.values()).some(student => {
    const original = studentsData.find(s => s.id === student.student_id);
    if (!original) return false;
    return (
      student.roll !== original.roll ||
      student.gender !== original.studentDetails?.gender ||
      student.religion_id !== original.studentDetails?.religion_id ||
      student.shift_id !== original.shift_id ||
      JSON.stringify((student as any).coaching_off_months || []) !== JSON.stringify(
        original.coaching_off ? original.coaching_off.split(',').map(Number) : []
      )
    );
  });

  return (
    <Card title={<Title level={5}><EditOutlined /> Bulk Student Update</Title>}>
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Class"
              name="class_id"
              rules={[{ required: true, message: 'Please select class' }]}
            >
              <Select
                placeholder="Select Class"
                loading={isClassOptionLoading}
                options={classOptions}
                value={selectedClassId}
                onChange={handleClassChange}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Shift"
              name="shift_id"
              rules={[{ required: true, message: 'Please select shift' }]}
            >
              <Select
                placeholder="Select Shift"
                options={SHIFT_OPTIONS}
                value={selectedShiftId}
                onChange={handleShiftChange}
                allowClear
                disabled={!selectedClassId}
              />
            </Form.Item>
          </Col>
        </Row>

        {selectedClassId && selectedShiftId && (
          <>
            <Spin spinning={isLoadingStudents}>
              {studentsData.length > 0 ? (
                <>
                  <Table
                    columns={columns}
                    dataSource={studentsData}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 1000 }}
                    style={{ marginTop: 24 }}
                  />
                  <Row className="mt-4">
                    <Col span={24} className="text-right">
                      <Space>
                        <Button
                          onClick={() => {
                            setEditedStudents(new Map());
                            refetch();
                          }}
                          disabled={!hasChanges}
                        >
                          Reset
                        </Button>
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={handleSave}
                          loading={isUpdating}
                          disabled={!hasChanges}
                        >
                          Save Changes
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </>
              ) : (
                <Empty description="No students found for the selected class and shift" />
              )}
            </Spin>
          </>
        )}

        {(!selectedClassId || !selectedShiftId) && (
          <Empty description="Please select both class and shift to view and edit students" />
        )}
      </Form>
    </Card>
  );
};

export default StudentBulkUpdateForm;

