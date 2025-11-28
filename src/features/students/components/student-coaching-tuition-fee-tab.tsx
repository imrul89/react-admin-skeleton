import { Row, Col } from 'antd';
import CoachingMonthlyPayments from '@features/students/components/payments/coaching-monthly-payments';
import PaymentInvoices from '@features/students/components/payments/payment-invoices';
import { Student } from '@models/student-model';
import { PAYMENT_INVOICE_TYPES } from '@utils/constants';

const StudentCoachingTuitionFeeTab = ({
  student
}: {
  student: Student;
}) => {
  return (
    <div className="space-y-6">
      <Row gutter={24}>
        <Col span={12}>
          <CoachingMonthlyPayments
            studentId={student.id}
            student={student}
          />
        </Col>
        <Col span={12}>
          <PaymentInvoices
            studentId={student.id}
            paymentInvoiceType={PAYMENT_INVOICE_TYPES.COACHING}
          />
        </Col>
      </Row>
    </div>
  );
};

export default StudentCoachingTuitionFeeTab;

