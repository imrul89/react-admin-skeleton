import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { App, Card, Form, Row, Col, Button, Select, DatePicker, Typography, Space, Tag, Divider, Alert } from 'antd';
import { SaveOutlined, WarningOutlined } from '@ant-design/icons';
import { useClassWiseAttendanceForm } from '@hooks/use-attendance';
import { useClassOptions } from '@hooks/use-school-classes';
import { StudentOption, useClassWiseStudents } from '@hooks/use-students';
import { useFormValidation } from '@hooks/utility-hooks/use-form-validation';
import { ClassWiseAttendanceRequest } from '@models/attendance-model';
import { useCheckAttendanceExistsMutation } from '@services/attendance-service';
import { ATTENDANCE_FOR } from '@utils/constants';

const { Text } = Typography;

const AttendanceForm = () => {
  const [form] = Form.useForm();
  const { modal } = App.useApp();
  const formValues = Form.useWatch([], form);
  const isFormValid = useFormValidation(form, formValues);

  const { isClassOptionLoading, classOptions } = useClassOptions();
  const { isLoading: isSaving, onSaved } = useClassWiseAttendanceForm();
  const [checkExists, { isLoading: isChecking }] = useCheckAttendanceExistsMutation();

  const [classId, setClassId] = useState<number | undefined>(undefined);
  const [attendanceFor, setAttendanceFor] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [absentStudentIds, setAbsentStudentIds] = useState<number[]>([]);
  const [existsWarning, setExistsWarning] = useState<{
    exists: boolean;
    marked_count: number;
    total_students: number;
  } | null>(null);

  const { onLoadClassWiseStudents, isStudentsLoading, students } = useClassWiseStudents();

  useEffect(() => {
    // Reset absent students when class changes
    setAbsentStudentIds([]);
    form.setFieldValue('absent_student_ids', []);
    setExistsWarning(null);
  }, [classId]);

  useEffect(() => {
    // Check if attendance already exists when parameters change
    const checkAttendanceExists = async () => {
      if (classId && attendanceFor && date) {
        try {
          const result = await checkExists({
            class_id: classId,
            attendance_for: attendanceFor,
            date: date.format('YYYY-MM-DD')
          }).unwrap();
          
          if (result.exists) {
            setExistsWarning(result);
          } else {
            setExistsWarning(null);
          }
        } catch (error) {
          console.error('Failed to check attendance:', error);
        }
      }
    };

    checkAttendanceExists();
  }, [classId, attendanceFor, date]);

  const handleClassChange = (value: number) => {
    setClassId(value);
    form.setFieldValue('class_id', value);
    
    if (value) {
      onLoadClassWiseStudents(value);
    }
  };

  const handleAttendanceForChange = (value: number) => {
    setAttendanceFor(value);
    form.setFieldValue('attendance_for', value);
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setDate(date);
      form.setFieldValue('date', date);
    }
  };

  const onFinished = () => {
    const className = (classOptions || []).find(c => c.value === classId)?.label || 'selected class';
    const attendanceType = ATTENDANCE_FOR.find(a => a.value === attendanceFor)?.label || 'selected type';
    const formattedDate = date.format('YYYY-MM-DD');
    
    modal.confirm({
      title: 'Confirm Attendance Submission',
      content: (
        <div>
          <p>Are you sure you want to save attendance for:</p>
          <p><strong>Class:</strong> {className}</p>
          <p><strong>Type:</strong> {attendanceType}</p>
          <p><strong>Date:</strong> {formattedDate}</p>
          <Divider style={{ margin: '12px 0' }} />
          <p><strong>Total Students:</strong> {students.length}</p>
          <p><strong>Present:</strong> <span style={{ color: '#52c41a' }}>{presentCount}</span></p>
          <p><strong>Absent:</strong> <span style={{ color: '#ff4d4f' }}>{absentCount}</span></p>
        </div>
      ),
      okText: 'Yes, Save',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: () => {
        const data: ClassWiseAttendanceRequest = {
          class_id: classId!,
          attendance_for: attendanceFor!,
          date: formattedDate,
          absent_student_ids: absentStudentIds
        };

        onSaved(data);
      }
    });
  };

  const presentCount = students.length - absentStudentIds.length;
  const absentCount = absentStudentIds.length;

  return (
    <Card title="Mark Class-Wise Attendance">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinished}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Class"
              name="class_id"
              rules={[{ required: true, message: 'Please select a class' }]}
              className="!mb-0"
            >
              <Select
                placeholder="Select class"
                loading={isClassOptionLoading}
                options={classOptions}
                onChange={handleClassChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Attendance For"
              name="attendance_for"
              rules={[{ required: true, message: 'Please select attendance type' }]}
              className="!mb-0"
            >
              <Select
                placeholder="Select attendance type"
                options={ATTENDANCE_FOR}
                onChange={handleAttendanceForChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Date"
              name="date"
              initialValue={dayjs()}
              rules={[{ required: true, message: 'Please select a date' }]}
              className="!mb-0"
            >
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                onChange={handleDateChange}
              />
            </Form.Item>
          </Col>
        </Row>

        {existsWarning && existsWarning.exists && (
          <Alert
            message="Attendance Already Exists"
            description={`Attendance has already been marked for ${existsWarning.marked_count} out of ${existsWarning.total_students} students in this class on this date. Creating new attendance will fail.`}
            type="warning"
            icon={<WarningOutlined />}
            showIcon
            closable
            className="mb-4"
          />
        )}

        {classId && attendanceFor && (
          <>
            <Divider />
            
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  label="Select Absent Students"
                >
                  <Select
                    key={absentStudentIds.length}
                    placeholder="Type roll or name to search and select"
                    showSearch
                    loading={isStudentsLoading}
                    options={students}
                    value={null}
                    onChange={(value: number) => {
                      if (value && !absentStudentIds.includes(value)) {
                        const newAbsentIds = [...absentStudentIds, value];
                        setAbsentStudentIds(newAbsentIds);
                        form.setFieldValue('absent_student_ids', newAbsentIds);
                      }
                    }}
                    filterOption={(input, option: any) => {
                      const searchText = input.toLowerCase();
                      const label = option?.label?.toString().toLowerCase() || '';
                      const roll = option?.roll?.toString() || '';
                      return label.includes(searchText) || roll.includes(searchText);
                    }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <Row gutter={16}>
                <Col span={8}>
                  <div className="text-center">
                    <Text type="secondary">Total Students</Text>
                    <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center">
                    <Text type="secondary">Present</Text>
                    <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center">
                    <Text type="secondary">Absent</Text>
                    <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                  </div>
                </Col>
              </Row>
            </div>

            {absentStudentIds.length > 0 && (
              <div className="mb-4">
                <Text strong>Absent Students:</Text>
                <div className="mt-2">
                  <Space size={[8, 8]} wrap>
                    {absentStudentIds.map(id => {
                      const student = students.find((s: StudentOption) => s.value === id);
                      return student ? (
                        <Tag key={id} color="red" closable onClose={() => {
                          const newAbsentIds = absentStudentIds.filter(sid => sid !== id);
                          setAbsentStudentIds(newAbsentIds);
                          form.setFieldValue('absent_student_ids', newAbsentIds);
                        }}>
                          {student.label}
                        </Tag>
                      ) : null;
                    })}
                  </Space>
                </div>
              </div>
            )}
          </>
        )}

        <Row className="mt-6">
          <Col span={24} className="text-right">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isSaving || isChecking}
              disabled={!isFormValid || students.length === 0 || (existsWarning?.exists || false)}
            >
              Save Attendance
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AttendanceForm;

