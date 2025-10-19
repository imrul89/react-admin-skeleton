import { Row, Col } from 'antd';
import MonthlyPayments from '@features/students/components/payments/monthly-payments';
import PaymentInvoices from '@features/students/components/payments/payment-invoices';
import { Student } from '@models/student-model';
import { PAYMENT_INVOICE_TYPES } from '@utils/constants';

const StudentTuitionFeeTab = ({
  student
}: {
  student: Student;
}) => {
  return (
    <div className="space-y-6">
      <Row gutter={24}>
        <Col span={12}>
          <MonthlyPayments
            studentId={student.id}
            paymentInvoiceType={PAYMENT_INVOICE_TYPES.SCHOOL}
          />
        </Col>
        <Col span={12}>
          <PaymentInvoices
            studentId={student.id}
            paymentInvoiceType={PAYMENT_INVOICE_TYPES.SCHOOL}
          />
        </Col>
      </Row>
    </div>
  );
};

export default StudentTuitionFeeTab;
