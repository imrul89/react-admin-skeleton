import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Modal } from 'antd';
import type { MenuProps } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Student } from '@models/student-model';

interface StudentTableColumnActionsProps {
  student: Student;
}

const StudentTableColumnActions = ({ student }: StudentTableColumnActionsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const items: MenuProps['items'] = [
    {
      key: `edit-${student.id}`,
      icon: <EditOutlined />,
      label: <Link to={`/students/${student.id}`}>
        Edit
      </Link>
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      onClick: () => {
        setIsDeleteModalOpen(true);
      }
    }
  ];

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete student:', student.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        overlayClassName="grid-action"
      >
        <Button shape="circle" icon={<MoreOutlined />} />
      </Dropdown>

      <Modal
        title="Delete Student"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this student?</p>
        <p><strong>Student:</strong> {student.studentDetails?.name}</p>
      </Modal>
    </>
  );
};

export default StudentTableColumnActions;
