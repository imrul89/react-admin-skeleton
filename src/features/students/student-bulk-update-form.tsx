import { useState, useMemo, useEffect, useCallback } from 'react';
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
  Checkbox,
  Space,
  Typography,
  Empty,
  Spin
} from 'antd';
import { SaveOutlined, EditOutlined } from '@ant-design/icons';
import { useClassOptions } from '@hooks/use-school-classes';
import { useStudentsForBulkUpdateQuery, useBulkUpdateStudentsMutation } from '@services/students-service';
import { Student } from '@models/student-model';
import { BulkUpdateStudentItem, BulkUpdateStudentsRequest } from '@models/student-bulk-update-model';
import { SHIFT_OPTIONS, RELIGIONS, MONTHS_SHORT } from '@utils/constants';

const { Text, Title } = Typography;

const StudentBulkUpdateForm = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { isClassOptionLoading, classOptions } = useClassOptions();
  
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
  const [selectedShiftId, setSelectedShiftId] = useState<number | undefined>();
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [editedStudents, setEditedStudents] = useState<Map<number, Partial<BulkUpdateStudentItem & { coaching_off_months?: number[] }>>>(new Map());

  const [bulkUpdate, { isLoading: isUpdating }] = useBulkUpdateStudentsMutation();

  // Use optimized endpoint for bulk update
  const { data: studentsResponse, isLoading: isLoadingStudents, refetch } = useStudentsForBulkUpdateQuery(
    { classId: selectedClassId!, shiftId: selectedShiftId! },
    { skip: !selectedClassId || !selectedShiftId }
  );

  useEffect(() => {
    if (studentsResponse?.students) {
      setStudentsData(studentsResponse.students);
      // Initialize edited students map - only store initial values, not all fields
      const initialMap = new Map<number, Partial<BulkUpdateStudentItem & { coaching_off_months?: number[] }>>();
      // Only initialize map, don't pre-populate with all values to reduce memory
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

  const handleFieldChange = useCallback((studentId: number, field: keyof BulkUpdateStudentItem | 'coaching_off_months', value: any) => {
    setEditedStudents(prev => {
      const updated = new Map(prev);
      const current = updated.get(studentId) || { student_id: studentId };
      updated.set(studentId, { ...current, [field]: value });
      return updated;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedClassId || !selectedShiftId) {
      message.error('Please select both class and shift');
      return;
    }

    if (editedStudents.size === 0) {
      message.warning('No changes to save');
      return;
    }

    try {
      // Create a map for faster lookups
      const studentsMap = new Map(studentsData.map(s => [s.id, s]));
      
      const studentsToUpdate: BulkUpdateStudentItem[] = Array.from(editedStudents.values())
        .filter(student => {
          // Only include students that have actual changes
          const original = studentsMap.get(student.student_id!);
          if (!original) return false;
          
          const originalMonths = original.coaching_off ? original.coaching_off.split(',').map(Number).sort() : [];
          const editedMonths = ((student as any).coaching_off_months || []).sort();
          
          return (
            student.roll !== original.roll ||
            student.gender !== original.studentDetails?.gender ||
            student.religion_id !== original.studentDetails?.religion_id ||
            student.shift_id !== original.shift_id ||
            JSON.stringify(editedMonths) !== JSON.stringify(originalMonths)
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
  }, [selectedClassId, selectedShiftId, editedStudents, studentsData, bulkUpdate, message, refetch]);

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: ['studentDetails', 'name'],
      key: 'name',
      width: 200,
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
      width: 80,
      align: 'center' as const,
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
      width: 140,
      align: 'center' as const,
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
            buttonStyle='solid'
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
      width: 140,
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
            placeholder="Select"
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
      width: 80,
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
      title: 'Coaching Off on Months',
      dataIndex: 'coaching_off',
      key: 'coaching_off',
      width: 300,
      render: (_: any, record: Student) => {
        const edited = editedStudents.get(record.id);
        const currentMonths = edited?.coaching_off_months !== undefined 
          ? edited.coaching_off_months 
          : (record.coaching_off ? record.coaching_off.split(',').map(Number) : []);
        
        const allMonthValues = MONTHS_SHORT.map(m => m.value);
        const allSelected = allMonthValues.every(month => currentMonths.includes(month));
        const someSelected = currentMonths.length > 0 && currentMonths.length < 12;
        
        const handleAllChange = (e: any) => {
          if (e.target.checked) {
            handleFieldChange(record.id, 'coaching_off_months', allMonthValues);
          } else {
            handleFieldChange(record.id, 'coaching_off_months', []);
          }
        };
        
        return (
          <div>
            <Checkbox
              indeterminate={someSelected}
              checked={allSelected}
              onChange={handleAllChange}
              style={{ marginBottom: '8px', fontWeight: 600 }}
            >
              All
            </Checkbox>
            <Checkbox.Group
              value={currentMonths}
              onChange={(value) => handleFieldChange(record.id, 'coaching_off_months', value)}
              style={{ 
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '4px'
              }}
            >
              {MONTHS_SHORT.map(month => (
                <Checkbox key={month.value} value={month.value}>
                  {month.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        );
      }
    }
  ], [editedStudents, handleFieldChange]);

  // Memoize hasChanges calculation to avoid expensive computation on every render
  const hasChanges = useMemo(() => {
    if (editedStudents.size === 0) return false;
    
    // Create a map for faster lookups
    const studentsMap = new Map(studentsData.map(s => [s.id, s]));
    
    return Array.from(editedStudents.values()).some(student => {
      const original = studentsMap.get(student.student_id!);
      if (!original) return false;
      
      const originalMonths = original.coaching_off ? original.coaching_off.split(',').map(Number).sort() : [];
      const editedMonths = ((student as any).coaching_off_months || []).sort();
      
      return (
        student.roll !== original.roll ||
        student.gender !== original.studentDetails?.gender ||
        student.religion_id !== original.studentDetails?.religion_id ||
        student.shift_id !== original.shift_id ||
        JSON.stringify(editedMonths) !== JSON.stringify(originalMonths)
      );
    });
  }, [editedStudents, studentsData]);

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
                    style={{ marginTop: 12 }}
                    size="small"
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

