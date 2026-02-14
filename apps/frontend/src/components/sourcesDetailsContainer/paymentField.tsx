'use client';
type PaymentFieldProps = {
  field: string;
  name: string | number | boolean | null;
};

export default function PaymentField({ field, name }: PaymentFieldProps) {
  return (
    <div className="flex gap-2 items-center my-0.5 overflow-x-auto">
      <span className="font-bold text-[#a9deff] whitespace-nowrap">{field}:</span>
      <span className="text-white break-all">
        {name !== null && name !== undefined ? String(name) : '--'}
      </span>
    </div>
  );
}
