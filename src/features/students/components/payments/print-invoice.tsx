import React from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { Student } from '@models/student-model';
import { TuitionFeePaymentInvoice } from '@models/tuition-fee-payment-model';
import { dateFormat, formatNumber, getMonthName } from '@utils/helpers';

export function printInvoice(invoice: (TuitionFeePaymentInvoice & { student?: Student }) | null, opts?: { widthMm?: number }) {
  if (!invoice) return;

  const widthMm = opts?.widthMm || 72;
  const student = (invoice as any).student;
  const title = `Invoice #${invoice.id}`;
  const createdAt = dateFormat(invoice.created_at);

  const style = `
    <style>
      @page { size: ${widthMm}mm auto; margin: 4mm; }
      html, body { width: ${widthMm}mm; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #000 }
      .invoice { width: 100%; }
      .center { text-align: center; }
      .right { text-align: right; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 4px 0; }
      .bold { font-weight: 700; }
      .sep { border-top: 1px dashed #000; margin: 8px 0; }
    </style>
  `;

  const rowsHtml = (invoice.monthly_payments || []).map((mp: any) => {
    const monthName = getMonthName(mp.month || 0);
    const heads = (mp.details || []).map((d: any) => `
      <tr>
        <td>${(d.head && d.head.title) || d.head_title}</td>
        <td class="right">${formatNumber(Number(d.head_amount || 0))}</td>
      </tr>
    `).join('');

    return `
      ${heads}
      <tr>
        <td class="right bold">Subtotal (${monthName}) :</td>
        <td class="right bold">${formatNumber(Number(mp.amount || 0))}</td>
      </tr>
    `;
  }).join('');

  const studentInfoHtml = `
    <div class="center bold" style="font-size: 16px;">School / Institute</div>
    <div class="sep"></div>
    <div class="center" style="font-size: 16px;">Money Receipt</div>
    <div class="sep"></div>
    <table>
      <tr>
        <td colspan="1"><strong>Name: </strong> ${student?.studentDetails?.name || '-'}</td>
      </tr>
      <tr>
        <td colspan="1">Student No.: ${student?.studentDetails?.student_no || '-'}</td>
      </tr>
      <tr>
        <td>Class: ${student?.class?.title || '-' }</td>
        <td class="right">Roll: ${student?.roll || '-'}</td>
      </tr>
      <tr>
        <td>${title}</td>
        <td class="right">Date: ${createdAt}</td>
      </tr>
    </table>
    <div style="height: 10px; width: 100%;"></div>
  `;

  const html = `
    <html lang="en">
      <head>
        <title>${title}</title>
        ${style}
      </head>
      <body>
        <div class="invoice">
          ${studentInfoHtml}
          <table>
            <thead>
              <tr style="border-bottom: 1px dashed #000; margin-bottom: 10px;">
                <th style="text-align:left">Fee Head</th>
                <th style="text-align:right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="sep"></div>
          <div style="display:flex; justify-content:space-between; font-weight:700;">
            <div>Invoice Total :</div>
            <div>${formatNumber(Number(invoice.total_amount))}</div>
          </div>
          <div style="height:20px"></div>
          <div class="right" style="padding-right: 20px;">Received By</div>
          <div class="right">------------------------</div>
          <div class="right" style="padding-right: 20px;">${invoice?.created_user?.name || ''}</div>
        </div>
      </body>
    </html>
  `;

  // Use a hidden iframe to avoid popup blockers and allow printing the generated HTML
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.setAttribute('aria-hidden', 'true');

    if ('srcdoc' in iframe) {
      (iframe as HTMLIFrameElement).srcdoc = html;
    }

    document.body.appendChild(iframe);

    // guard to ensure we print only once
    let printed = false;
    let printTimeout: number | undefined;
    let removeTimeout: number | undefined;

    const cleanup = () => {
      try {
        if (typeof printTimeout !== 'undefined') window.clearTimeout(printTimeout);
        if (typeof removeTimeout !== 'undefined') window.clearTimeout(removeTimeout);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
      } catch (e) {
        /* ignore */
      }
    };

    const printFromFrame = () => {
      if (printed) return;
      printed = true;
      try {
        const win = (iframe as HTMLIFrameElement).contentWindow;
        if (!win) {
          cleanup();
          return;
        }
        win.focus();
        // attach afterprint handler so we always cleanup when the print dialog closes
        try {
          // Some browsers may not support onafterprint on iframe windows, guard it
          (win as any).onafterprint = () => {
            try { cleanup(); } catch (e) { /* ignore */ }
          };
        } catch (e) {
          // ignore
        }

        // delay slightly for stable rendering in some drivers
        printTimeout = window.setTimeout(() => {
          try { win.print(); } catch (e) { /* ignore */ }
          // remove iframe after print attempt as a fallback
          removeTimeout = window.setTimeout(() => {
            try { cleanup(); } catch (e) { /* ignore */ }
          }, 500);
        }, 200);
      } catch (e) {
        cleanup();
      }
    };

    if (!('srcdoc' in iframe)) {
      const doc = (iframe as HTMLIFrameElement).contentDocument || (iframe as HTMLIFrameElement).contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }

    // Try to print once the iframe loads
    iframe.onload = () => printFromFrame();

    // Fallback: if onload doesn't fire, attempt to print after a short delay
    window.setTimeout(() => {
      if (document.body.contains(iframe) && !printed) printFromFrame();
    }, 1000);
  } catch (e) {
    // last resort: open a new window (may be blocked by popup blockers)
    if ((window as any)._printingOnce) return;
    (window as any)._printingOnce = true;
    try {
      const printWindow = window.open('', '_blank', 'noopener,noreferrer');
      if (!printWindow) return;
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      // attach afterprint handler to clear the flag when dialog closes
      try {
        (printWindow as any).onafterprint = () => {
          try { (window as any)._printingOnce = false; } catch (e) {}
        };
      } catch (e) {}

      setTimeout(() => {
        try { printWindow.print(); } catch (err) { /* ignore */ }
        // fallback: clear the flag after a delay in case onafterprint didn't fire
        setTimeout(() => { try { (window as any)._printingOnce = false; } catch (e) {} }, 2000);
      }, 500);
    } catch (err) {
      try { (window as any)._printingOnce = false; } catch (e) {}
    }
  }
}

export default function PrintInvoiceButton({
  invoice,
  widthMm,
  children,
  buttonProps
}: {
  invoice: (TuitionFeePaymentInvoice & { student?: Student }) | null;
  widthMm?: number;
  children?: React.ReactNode;
  buttonProps?: any;
}) {
  return (
    <Button
      type="primary"
      icon={<PrinterOutlined />}
      onClick={() => printInvoice(invoice, { widthMm })}
      disabled={!invoice}
      {...buttonProps}
    >
      {children || 'Print'}
    </Button>
  );
}
