import { useState, useMemo } from 'react';
import { Card, Select, Button, Checkbox, Space, Typography, App, Empty, Spin, Tag, Input, Table, Radio, Modal } from 'antd';
import { DragOutlined, SaveOutlined, TableOutlined, AppstoreOutlined, SearchOutlined } from '@ant-design/icons';
import { useClassOptions } from '@hooks/use-school-classes';
import { useSectionOptions } from '@hooks/use-sections';
import { useStudentsQuery, useBulkAssignSectionMutation } from '@services/students-service';
import { formatQueryParams } from '@utils/helpers';
import { Student } from '@models/student-model';
import { SHIFTS } from '@utils/constants';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface DraggableStudent extends Student {
  isDragging?: boolean;
  isSelected?: boolean;
  pendingSectionId?: number | null;
}

const SectionAssignment = () => {
  const { message } = App.useApp();

  const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
  const [selectedShiftId, setSelectedShiftId] = useState<number | undefined>();
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(new Set());
  const [draggedStudentId, setDraggedStudentId] = useState<number | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<number | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Map<number, number | null>>(new Map());
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<number | 'unassigned' | 'all'>('all');

  const { classOptions } = useClassOptions();
  const { sectionOptions, isSectionOptionLoading } = useSectionOptions(selectedClassId);
  const [bulkAssignSection, { isLoading: isAssigning }] = useBulkAssignSectionMutation();

  // Fetch students for selected class and shift (both required)
  const queryParams = useMemo(() => {
    if (!selectedClassId || !selectedShiftId) return '';
    return formatQueryParams({
      class_id: selectedClassId,
      shift_id: selectedShiftId,
      limit: 1000,
      offset: 0
    });
  }, [selectedClassId, selectedShiftId]);

  const { data: studentsData, isLoading: isLoadingStudents, refetch } = useStudentsQuery(queryParams, {
    skip: !selectedClassId || !selectedShiftId || queryParams === ''
  });

  const students = useMemo<DraggableStudent[]>(() => {
    if (!studentsData?.students) return [];
    return studentsData.students.map(student => {
      const pendingSectionId = pendingChanges.get(student.id);
      return {
        ...student,
        isSelected: selectedStudentIds.has(student.id),
        pendingSectionId: pendingSectionId !== undefined ? pendingSectionId : undefined
      };
    });
  }, [studentsData, selectedStudentIds, pendingChanges]);

  // Group students by section (including pending changes) and sort by roll
  const studentsBySection = useMemo(() => {
    const grouped: Record<number | 'unassigned', DraggableStudent[]> = {
      unassigned: []
    };

    students.forEach(student => {
      // Use pending section if available, otherwise use current section
      const displaySectionId = student.pendingSectionId !== undefined 
        ? student.pendingSectionId 
        : student.section_id;
      const sectionKey = displaySectionId || 'unassigned';
      if (!grouped[sectionKey]) {
        grouped[sectionKey] = [];
      }
      grouped[sectionKey].push(student);
    });

    // Sort each group by roll number (null/undefined rolls go to the end)
    Object.keys(grouped).forEach(key => {
      grouped[key as number | 'unassigned'].sort((a, b) => {
        const rollA = a.roll ?? Number.MAX_SAFE_INTEGER;
        const rollB = b.roll ?? Number.MAX_SAFE_INTEGER;
        return rollA - rollB;
      });
    });

    return grouped;
  }, [students]);

  const handleClassChange = (classId: number) => {
    setSelectedClassId(classId);
    setSelectedStudentIds(new Set());
    setDraggedStudentId(null);
    setDragOverSectionId(null);
    setPendingChanges(new Map());
  };

  const handleShiftChange = (shiftId: number) => {
    setSelectedShiftId(shiftId);
    setSelectedStudentIds(new Set());
    setDraggedStudentId(null);
    setDragOverSectionId(null);
    setPendingChanges(new Map());
  };

  const handleSelectStudent = (studentId: number, checked: boolean) => {
    const newSelected = new Set(selectedStudentIds);
    if (checked) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedStudentIds(newSelected);
  };

  const handleSelectAll = (checked: boolean, sectionId: number | 'unassigned' | null) => {
    let studentsToSelect: DraggableStudent[] = [];
    
    if (sectionId === 'unassigned' || sectionId === null) {
      // Select all unassigned students
      studentsToSelect = students.filter(s => {
        const displaySectionId = s.pendingSectionId !== undefined ? s.pendingSectionId : s.section_id;
        return !displaySectionId;
      });
    } else {
      // Select all students in the specific section
      studentsToSelect = students.filter(s => {
        const displaySectionId = s.pendingSectionId !== undefined ? s.pendingSectionId : s.section_id;
        return displaySectionId === sectionId;
      });
    }

    if (checked) {
      const newSelected = new Set(selectedStudentIds);
      studentsToSelect.forEach(student => newSelected.add(student.id));
      setSelectedStudentIds(newSelected);
    } else {
      const newSelected = new Set(selectedStudentIds);
      studentsToSelect.forEach(student => newSelected.delete(student.id));
      setSelectedStudentIds(newSelected);
    }
  };

  const handleDragStart = (e: React.DragEvent, studentId: number) => {
    setDraggedStudentId(studentId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('studentId', studentId.toString());
  };

  const handleDragOver = (e: React.DragEvent, sectionId: number | null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSectionId(sectionId);
  };

  const handleDragLeave = () => {
    setDragOverSectionId(null);
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: number | null) => {
    e.preventDefault();
    setDragOverSectionId(null);

    const studentId = parseInt(e.dataTransfer.getData('studentId'), 10);
    if (!studentId || !selectedClassId) return;

    // Add to pending changes instead of updating immediately
    setPendingChanges(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, targetSectionId);
      return newMap;
    });
    setDraggedStudentId(null);
  };

  const handleBulkAssign = (sectionId: number | null) => {
    if (selectedStudentIds.size === 0) {
      message.warning('Please select at least one student');
      return;
    }

    // Add to pending changes instead of updating immediately
    setPendingChanges(prev => {
      const newMap = new Map(prev);
      selectedStudentIds.forEach(studentId => {
        newMap.set(studentId, sectionId);
      });
      return newMap;
    });
    setSelectedStudentIds(new Set());
  };

  const handleUpdateAll = async () => {
    if (pendingChanges.size === 0) {
      message.warning('No pending changes to update');
      return;
    }

    if (!selectedClassId) return;

    try {
      // Group students by target section for efficient bulk updates
      const changesBySection = new Map<number | null, number[]>();
      
      pendingChanges.forEach((sectionId, studentId) => {
        if (!changesBySection.has(sectionId)) {
          changesBySection.set(sectionId, []);
        }
        changesBySection.get(sectionId)!.push(studentId);
      });

      // Apply all changes
      const updatePromises = Array.from(changesBySection.entries()).map(([sectionId, studentIds]) =>
        bulkAssignSection({
          class_id: selectedClassId,
          student_ids: studentIds,
          section_id: sectionId
        }).unwrap()
      );

      await Promise.all(updatePromises);

      message.success(`Successfully updated ${pendingChanges.size} student(s)`);
      setPendingChanges(new Map());
      setSelectedStudentIds(new Set());
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to update student sections');
    }
  };

  const handleClearPending = () => {
    setPendingChanges(new Map());
    message.info('Pending changes cleared');
  };

  const unassignedStudents = studentsBySection['unassigned'] || [];

  // Filtered students for table view
  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Filter by section
    if (selectedSectionFilter !== 'all') {
      filtered = filtered.filter(s => {
        const displaySectionId = s.pendingSectionId !== undefined ? s.pendingSectionId : s.section_id;
        if (selectedSectionFilter === 'unassigned') {
          return !displaySectionId;
        }
        return displaySectionId === selectedSectionFilter;
      });
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(s => {
        const name = s.studentDetails?.name?.toLowerCase() || '';
        const roll = s.roll?.toString() || '';
        const studentNo = s.studentDetails?.student_no?.toLowerCase() || '';
        return name.includes(searchLower) || roll.includes(searchLower) || studentNo.includes(searchLower);
      });
    }

    // Sort by roll
    return filtered.sort((a, b) => {
      const rollA = a.roll ?? Number.MAX_SAFE_INTEGER;
      const rollB = b.roll ?? Number.MAX_SAFE_INTEGER;
      return rollA - rollB;
    });
  }, [students, selectedSectionFilter, searchText]);

  // Table columns
  const tableColumns: ColumnsType<DraggableStudent> = [
    {
      title: 'Roll',
      dataIndex: 'roll',
      key: 'roll',
      width: 80,
      sorter: (a, b) => (a.roll ?? 0) - (b.roll ?? 0),
      render: (roll) => roll || '-'
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => record.studentDetails?.name || 'Unknown'
    },
    {
      title: 'Student No',
      key: 'student_no',
      render: (_, record) => record.studentDetails?.student_no || '-'
    },
    {
      title: 'Current Section',
      key: 'current_section',
      width: 150,
      render: (_, record) => {
        const displaySectionId = record.pendingSectionId !== undefined ? record.pendingSectionId : record.section_id;
        if (!displaySectionId) return <Tag>Unassigned</Tag>;
        const section = sectionOptions.find(s => s.value === displaySectionId);
        return section ? <Tag>{section.label}</Tag> : '-';
      }
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        if (record.pendingSectionId !== undefined) {
          return <Tag color="orange">Pending</Tag>;
        }
        return null;
      }
    }
  ];

  const handleQuickAssign = (sectionId: number | null) => {
    if (selectedStudentIds.size === 0) {
      message.warning('Please select at least one student');
      return;
    }

    Modal.confirm({
      title: 'Assign Students',
      content: `Assign ${selectedStudentIds.size} selected student(s) to ${sectionId ? sectionOptions.find(s => s.value === sectionId)?.label : 'Unassigned'}?`,
      onOk: () => {
        handleBulkAssign(sectionId);
      }
    });
  };

  return (
    <div className="p-6">
      <Card>
        <Space direction="vertical" size="large" className="w-full">
          <div className="flex justify-between items-start">
            <div>
              <Title level={4}>Assign Students to Sections</Title>
              <Text type="secondary">
                {viewMode === 'table' 
                  ? 'Select students and assign them to sections using quick assign buttons'
                  : 'Drag and drop students to sections or use bulk assignment'}
              </Text>
            </div>
            <Space>
              <Radio.Group 
                value={viewMode} 
                onChange={(e) => setViewMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="table">
                  <TableOutlined /> Table View
                </Radio.Button>
                <Radio.Button value="cards">
                  <AppstoreOutlined /> Card View
                </Radio.Button>
              </Radio.Group>
              {pendingChanges.size > 0 && (
                <>
                  <Button onClick={handleClearPending}>
                    Clear Changes ({pendingChanges.size})
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleUpdateAll}
                    loading={isAssigning}
                  >
                    Update All ({pendingChanges.size})
                  </Button>
                </>
              )}
            </Space>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <Text strong>Select Class:</Text>
              <Select
                style={{ width: 200, marginLeft: 8 }}
                placeholder="Select a class"
                options={classOptions}
                value={selectedClassId}
                onChange={handleClassChange}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>
            <div>
              <Text strong>Select Shift:</Text>
              <Select
                style={{ width: 200, marginLeft: 8 }}
                placeholder="Select shift"
                options={SHIFTS}
                value={selectedShiftId}
                onChange={handleShiftChange}
              />
            </div>
          </div>

          {selectedClassId && selectedShiftId && (
            <>
              {isLoadingStudents ? (
                <div className="flex justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : viewMode === 'table' ? (
                <Card>
                  <Space direction="vertical" size="middle" className="w-full">
                    {/* Filters and Actions */}
                    <div className="flex flex-wrap gap-4 items-center">
                      <Input
                        placeholder="Search by name, roll, or student number"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                      />
                      <Select<number | 'unassigned' | 'all'>
                        placeholder="Filter by Section"
                        style={{ width: 200 }}
                        value={selectedSectionFilter}
                        onChange={(value) => setSelectedSectionFilter(value)}
                        options={[
                          { label: 'All Sections', value: 'all' },
                          { label: 'Unassigned', value: 'unassigned' },
                          ...sectionOptions.map(s => ({ label: s.label, value: s.value as number }))
                        ]}
                      />
                      {selectedStudentIds.size > 0 && (
                        <Space>
                          <Text strong>Selected: {selectedStudentIds.size}</Text>
                          <Select
                            placeholder="Quick Assign Selected"
                            style={{ width: 200 }}
                            onChange={(value: number | null) => handleQuickAssign(value)}
                            options={[
                              { label: 'Unassigned', value: null },
                              ...sectionOptions.map(s => ({ label: `Assign to ${s.label}`, value: s.value }))
                            ]}
                          />
                          <Button onClick={() => setSelectedStudentIds(new Set())}>
                            Clear Selection
                          </Button>
                        </Space>
                      )}
                    </div>

                    {/* Table */}
                    <Table
                      columns={tableColumns}
                      dataSource={filteredStudents}
                      rowKey="id"
                      rowSelection={{
                        selectedRowKeys: Array.from(selectedStudentIds),
                        onChange: (selectedRowKeys) => {
                          setSelectedStudentIds(new Set(selectedRowKeys as number[]));
                        },
                        onSelectAll: (selected) => {
                          const newSelected = new Set(selectedStudentIds);
                          if (selected) {
                            filteredStudents.forEach(s => newSelected.add(s.id));
                          } else {
                            filteredStudents.forEach(s => newSelected.delete(s.id));
                          }
                          setSelectedStudentIds(newSelected);
                        }
                      }}
                      pagination={{
                        pageSize: 50,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} students`,
                        pageSizeOptions: ['25', '50', '100', '200']
                      }}
                      scroll={{ y: 600 }}
                      size="small"
                    />
                  </Space>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Unassigned Students */}
                  <Card
                    title={
                      <div className="flex justify-between items-center">
                        <span>Unassigned ({unassignedStudents.length})</span>
                        {selectedStudentIds.size > 0 && (
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => handleBulkAssign(null)}
                          >
                            Assign Selected
                          </Button>
                        )}
                      </div>
                    }
                    className={`min-h-[400px] ${dragOverSectionId === null ? 'border-blue-500 border-2' : ''}`}
                    onDragOver={(e) => handleDragOver(e, null)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, null)}
                  >
                    <div className="mb-2">
                      <Checkbox
                        checked={
                          unassignedStudents.length > 0 &&
                          unassignedStudents.every(s => selectedStudentIds.has(s.id))
                        }
                        indeterminate={
                          unassignedStudents.some(s => selectedStudentIds.has(s.id)) &&
                          !unassignedStudents.every(s => selectedStudentIds.has(s.id))
                        }
                        onChange={(e) => handleSelectAll(e.target.checked, 'unassigned')}
                      >
                        Select All ({unassignedStudents.length})
                      </Checkbox>
                    </div>
                    <Space direction="vertical" size="small" className="w-full">
                      {unassignedStudents.length === 0 ? (
                        <Empty description="No unassigned students" />
                      ) : (
                        unassignedStudents.map((student) => (
                          <div
                            key={student.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, student.id)}
                            className={`p-2 border rounded cursor-move hover:bg-gray-50 ${
                              draggedStudentId === student.id ? 'opacity-50' : ''
                            } ${student.isSelected ? 'bg-blue-50 border-blue-300' : ''} ${
                              student.pendingSectionId !== undefined ? 'border-orange-400 bg-orange-50' : ''
                            }`}
                          >
                            <Checkbox
                              checked={student.isSelected}
                              onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Space>
                                <DragOutlined />
                                <Text>
                                  {student.studentDetails?.name || 'Unknown'} 
                                  {student.roll && ` (Roll: ${student.roll})`}
                                </Text>
                                {student.pendingSectionId !== undefined && (
                                  <Tag color="orange">Pending</Tag>
                                )}
                              </Space>
                            </Checkbox>
                          </div>
                        ))
                      )}
                    </Space>
                  </Card>

                  {/* Sections */}
                  {isSectionOptionLoading ? (
                    <div className="col-span-2 flex justify-center items-center">
                      <Spin />
                    </div>
                  ) : (
                    sectionOptions.map((section) => {
                      const sectionId = typeof section.value === 'number' ? section.value : null;
                      const sectionStudents = sectionId !== null ? (studentsBySection[sectionId] || []) : [];
                      return (
                        <Card
                          key={String(section.value)}
                          title={
                            <div className="flex justify-between items-center">
                              <span>{section.label} ({sectionStudents.length})</span>
                              {selectedStudentIds.size > 0 && (
                                <Button
                                  size="small"
                                  type="primary"
                                  onClick={() => handleBulkAssign(sectionId)}
                                >
                                  Assign Selected
                                </Button>
                              )}
                            </div>
                          }
                          className={`min-h-[400px] ${
                            dragOverSectionId === sectionId ? 'border-blue-500 border-2' : ''
                          }`}
                          onDragOver={(e) => handleDragOver(e, sectionId)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, sectionId)}
                        >
                          <div className="mb-2">
                            <Checkbox
                              checked={
                                sectionStudents.length > 0 &&
                                sectionStudents.every((s: DraggableStudent) => selectedStudentIds.has(s.id))
                              }
                              indeterminate={
                                sectionStudents.some((s: DraggableStudent) => selectedStudentIds.has(s.id)) &&
                                !sectionStudents.every((s: DraggableStudent) => selectedStudentIds.has(s.id))
                              }
                              onChange={(e) => handleSelectAll(e.target.checked, sectionId)}
                            >
                              Select All ({sectionStudents.length})
                            </Checkbox>
                          </div>
                          <Space direction="vertical" size="small" className="w-full">
                            {sectionStudents.length === 0 ? (
                              <Empty description="No students assigned" />
                            ) : (
                              sectionStudents.map((student: DraggableStudent) => (
                                <div
                                  key={student.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, student.id)}
                                  className={`p-2 border rounded cursor-move hover:bg-gray-50 ${
                                    draggedStudentId === student.id ? 'opacity-50' : ''
                                  } ${student.isSelected ? 'bg-blue-50 border-blue-300' : ''} ${
                                    student.pendingSectionId !== undefined ? 'border-orange-400 bg-orange-50' : ''
                                  }`}
                                >
                                  <Checkbox
                                    checked={student.isSelected}
                                    onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Space>
                                      <DragOutlined />
                                      <Text>
                                        {student.studentDetails?.name || 'Unknown'}
                                        {student.roll && ` (Roll: ${student.roll})`}
                                      </Text>
                                      {student.pendingSectionId !== undefined && (
                                        <Tag color="orange">Pending</Tag>
                                      )}
                                    </Space>
                                  </Checkbox>
                                </div>
                              ))
                            )}
                          </Space>
                        </Card>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}

          {(!selectedClassId || !selectedShiftId) && (
            <Empty description="Please select both class and shift to view students and sections" />
          )}
        </Space>
      </Card>
    </div>
  );
};

export default SectionAssignment;

