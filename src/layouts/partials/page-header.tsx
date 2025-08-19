import React from 'react';
import { Row, Col, Typography, Flex, Card } from 'antd';
import Breadcrumbs from '@components/shared/breadcrumbs';
import TypographyWrapper from '@components/shared/typography-wrapper';

const PageHeader = ({
  title,
  subTitle,
  menu,
  children
}: {
  title?: string;
  menu?: React.ReactNode;
  subTitle?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Card className="bg-white">
      <Breadcrumbs />
      <div className="py-3">
        <Row>
          <Col span={24}>
            <Flex justify="space-between" align="center">
              <Typography.Title level={2} style={{ marginBottom: 0 }}>
                {title}
              </Typography.Title>
              <div className="text-right">
                {children}
              </div>
            </Flex>
          </Col>
          {subTitle && (
            <div className="mt-4">
              <TypographyWrapper type="text" textType="secondary">
                {subTitle}
              </TypographyWrapper>
            </div>
          )}
        </Row>
      </div>
      {menu && (
        <div>
          {menu}
        </div>
      )}
    </Card>
  );
};

export default PageHeader;
