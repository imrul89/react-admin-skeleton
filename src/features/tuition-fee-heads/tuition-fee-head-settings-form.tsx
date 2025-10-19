import { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Button, Select, Table, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useClassOptions } from '@hooks/use-school-classes';
import { useTuitionFeeHeadConfigs, useTuitionFeeHeadSettingsForm } from '@hooks/use-tuition-fee-heads';
import { TuitionFeeHead, TuitionFeeHeadConfigRequestData } from '@models/tuition-fee-head-model';
import { MONTHS, TUITION_FEE_HEAD_TYPES } from '@utils/constants';
import { validationMessage } from '@utils/helpers/message-helpers';

interface FormValues {
  typeId: number;
  classId: number;
  configs: Record<number, {
    old_amount: number;
    new_amount?: number;
    months: number[];
  }>;
}

const TuitionFeeHeadSettingsForm = () => {
  const [form] = Form.useForm();
  const typeId = Form.useWatch('typeId', form);
  const classId = Form.useWatch('classId', form);

  const { isClassOptionLoading, classOptions } = useClassOptions();
  const { onLoadConfigs, isLoading, headConfigs } = useTuitionFeeHeadConfigs();
  const { isLoading: isSaving, onSaved: onSavedHeadSettings } = useTuitionFeeHeadSettingsForm();

  // Add state to control dropdown open for each head
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

  const onFinished = (values: FormValues) => {
    const class_id = values.classId;
    const configs = values.configs || {};
    
    const requestData: TuitionFeeHeadConfigRequestData[] = Object.entries(configs)
      .map(([headKey, config]) => {
        const headId = headKey.replace('head_', '');
        
        return {
          class_id,
          tuition_fee_head_id: Number(headId),
          old_amount: Number(config.old_amount || 0),
          new_amount: config.new_amount ? Number(config.new_amount) : undefined,
          months: Array.isArray(config.months) ? config.months : [],
        };
      })
      .filter(item =>
        item.old_amount > 0 ||
        item.new_amount !== undefined ||
        (item.months && item.months.length > 0)
      );
    
    onSavedHeadSettings(class_id, requestData);
  };
  
  useEffect(() => {
    if (typeId && classId) {
      onLoadConfigs(typeId, classId);
    }
  }, [typeId, classId]);

  useEffect(() => {
    if (headConfigs && headConfigs.length > 0) {
      const configsData = headConfigs.reduce((acc: Record<string, any>, head: TuitionFeeHead) => {
        // configs is an array, so we get the first element if it exists
        const config = head.configs && head.configs.length > 0 ? head.configs[0] : null;
        acc[`head_${head.id}`] = {
          old_amount: config?.old_amount || null,
          new_amount: config?.new_amount || null,
          months: config?.months || []
        };
        return acc;
      }, {});
      
      form.setFieldsValue({
        configs: configsData
      });
    }
  }, [headConfigs, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onFinish={onFinished}
    >
      <Card title="Head Settings">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Account Type"
              name="typeId"
              rules={[
                { required: true, message: validationMessage('account type') }
              ]}
            >
              <Select
                options={TUITION_FEE_HEAD_TYPES}
                placeholder="Select Account Type"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Class"
              name="classId"
              rules={[
                { required: true, message: validationMessage('class') }
              ]}
            >
              <Select
                loading={isClassOptionLoading}
                options={classOptions}
                placeholder="Select Class"
                optionFilterProp="label"
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Table
              loading={isLoading}
              dataSource={headConfigs}
              rowKey="id"
              sticky={{ offsetHeader: 66 }}
              pagination={false}
              className="border-1 border-gray-100 rounded-lg"
            >
              <Table.Column
                title="Head"
                dataIndex={['title']}
                key="title"
                width={250}
                render={(value: string) => (
                  <span>{value}</span>
                )}
              />
              <Table.Column
                title={
                  <>
                    <div>Amount</div>
                    <div className="text-gray-700 text-xs font-normal">(For Old Student)</div>
                  </>
                }
                key="amount"
                width={140}
                render={(record: TuitionFeeHead) => {
                  const config = record.configs && record.configs.length > 0 ? record.configs[0] : null;
                  return (
                    <Form.Item
                      name={['configs', `head_${record.id}`, 'old_amount']}
                      noStyle
                      initialValue={config?.old_amount || 0}
                    >
                      <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
                    </Form.Item>
                  );
                }}
              />
              <Table.Column
                title={
                  <>
                    <div>Amount</div>
                    <div className="text-gray-700 text-xs font-normal">(For New Student)</div>
                  </>
                }
                key="amount2"
                width={140}
                render={(record: TuitionFeeHead) => {
                  const config = record.configs && record.configs.length > 0 ? record.configs[0] : null;
                  return (
                    <Form.Item
                      name={['configs', `head_${record.id}`, 'new_amount']}
                      noStyle
                      initialValue={config?.new_amount}
                    >
                      <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
                    </Form.Item>
                  );
                }}
              />
              <Table.Column
                title="Months"
                key="months"
                render={(record: TuitionFeeHead) => {
                  const config = record.configs && record.configs.length > 0 ? record.configs[0] : null;
                  const allMonthValues = MONTHS.map((month) => month.value);
                  const headKey = `head_${record.id}`;
                  return (
                    <Form.Item
                      name={['configs', headKey, 'months']}
                      noStyle
                      initialValue={config?.months || []}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        showSearch={false}
                        placeholder="Select months"
                        className="w-full"
                        options={[{ label: 'All', value: 'all' }, ...MONTHS.map((month) => ({ label: month.label, value: month.value }))]}
                        open={dropdownOpen[headKey]}
                        onOpenChange={(open) => {
                          setDropdownOpen((prev) => ({ ...prev, [headKey]: open }));
                        }}
                        onChange={(selected) => {
                          if (selected.includes('all')) {
                            form.setFieldsValue({
                              configs: {
                                ...form.getFieldValue('configs'),
                                [headKey]: {
                                  ...form.getFieldValue(['configs', headKey]),
                                  months: allMonthValues,
                                },
                              },
                            });
                            
                            setDropdownOpen((prev) => ({ ...prev, [headKey]: false }));
                          }
                        }}
                      />
                    </Form.Item>
                  );
                }}
              />
            </Table>
          </Col>
        </Row>
      </Card>
      <Row className="my-6">
        <Col span={24} className="text-right">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isLoading}
            disabled={!typeId || !classId || isSaving}
          >
            Save changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default TuitionFeeHeadSettingsForm;
