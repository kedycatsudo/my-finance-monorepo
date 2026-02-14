'use client';
import { FinancePayment } from '@/types/finance';
import { InvestmentItem } from '@/types/investments';
import PaymentField from './paymentField';
import Image from 'next/image';
import { assetPrefix } from '@/constants/config';

type PaymentsContainerProps = {
  payment: FinancePayment | InvestmentItem;
  open: boolean;
  onClick: () => void;
};

// Type guards for dynamic rendering
function isFinancePayment(p: FinancePayment | InvestmentItem): p is FinancePayment {
  return 'status' in p && 'loop' in p;
}

export default function PaymentsContainer({ payment, open, onClick }: PaymentsContainerProps) {
  // Define field labels for both types
  const financeFieldLabels: { [K in keyof FinancePayment]?: string } = {
    name: 'Name',
    type: 'Type',
    amount: 'Amount',
    date: 'Date',
    loop: 'Loop',
    status: 'Status',
  };

  const investmentFieldLabels: { [K in keyof InvestmentItem]?: string } = {
    assetName: 'Asset Name',
    term: 'Term',
    investedAmount: 'Invested Amount',
    entryDate: 'Entry Date',
    exitDate: 'Exit Date',
    result: 'Result',
    resultAmount: 'Result Amount',
    status: 'Status',
  };

  // Choose the correct labels and keys
  const fields: [string, string][] = isFinancePayment(payment)
    ? Object.entries(financeFieldLabels)
    : Object.entries(investmentFieldLabels);

  return (
    <div
      className={`text-[#FFFFF] w-full flex flex-col rounded gap-2 p-2 cursor-pointer transition-all ${
        open ? 'bg-[#29388A]' : ''
      }`}
    >
      <div className="flex flex-row justify-start items-center">
        <h1
          className={`text-2xl xs:text-3xl text-[#FFFFF] font-bold mr-2`}
          onClick={onClick}
          tabIndex={0}
          role="button"
        >
          {isFinancePayment(payment) ? payment.name : payment.assetName}
        </h1>
        <h1
          className={`text-2xl xs:text-3xl text-[#FFFFF] font-bold mr-2`}
          onClick={onClick}
          tabIndex={0}
          role="button"
        >
          {isFinancePayment(payment)
            ? payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) + '$'
            : payment.investedAmount
              ? payment.investedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) + '$'
              : ''}
        </h1>
        <Image
          onClick={onClick}
          src={`${assetPrefix}sourceArrowBig.svg`}
          alt="Menu icon"
          width={32}
          height={32}
          className={`w-8 h-8 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </div>
      {open && (
        <div>
          {fields.map(([field, label]) => {
            // @ts-ignore: Index dynamic field
            const value = payment[field];
            let displayValue =
              typeof value === 'boolean'
                ? value
                  ? 'Yes'
                  : 'No'
                : field === 'amount' || field === 'investedAmount' || field === 'resultAmount'
                  ? value != null
                    ? `${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })} $`
                    : '--'
                  : value != null
                    ? String(value)
                    : '--';

            return <PaymentField key={field} field={label!} name={displayValue} />;
          })}
        </div>
      )}
    </div>
  );
}
