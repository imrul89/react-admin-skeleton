import { useEffect, useState } from 'react';
import { Card, Form, Row, Col, Button, Tree } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useAllPermissions } from '@hooks/use-permissions';
import { useRolePermissionForm } from '@hooks/use-roles';
import { validationMessage } from '@utils/helpers/message-helpers';

interface RolePermissionProps {
  roleId: number;
  rolePermissions: number[];
}

const RolePermissionForm = ({
  roleId,
  rolePermissions = []
}: RolePermissionProps) => {
  const [form] = Form.useForm();
  const [checkedKeys, setCheckedKeys] = useState(rolePermissions.map(String));

  const { permissions } = useAllPermissions();
  const { onSaved, isLoading } = useRolePermissionForm();

  const onFinished = (values: {
    permissions: string[];
  }) => {
    const selectedPermissions = values.permissions.filter(permission => Number(permission)).map(Number);
    
    onSaved(roleId, selectedPermissions);
  };
  
  useEffect(() => {
    setCheckedKeys(rolePermissions.map(String));
  }, [rolePermissions]);
  
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onFinish={onFinished}
    >
      <Card title="Role Permissions">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Permissions"
              name="permissions"
              rules={[
                {required: true, message: validationMessage('permissions')}
              ]}
            >
              <Tree
                checkable
                treeData={permissions}
                checkedKeys={checkedKeys}
                onCheck={(checkedKeys) => {
                  setCheckedKeys(checkedKeys as string[]);
                  form.setFieldsValue({ permissions: checkedKeys });
                }}
                expandedKeys={permissions.map(item => item.key as string)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Row className="my-6">
        <Col span={24} className="text-right">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined/>}
            loading={isLoading}
            disabled={checkedKeys.length === 0}
          >
            Save changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default RolePermissionForm;
