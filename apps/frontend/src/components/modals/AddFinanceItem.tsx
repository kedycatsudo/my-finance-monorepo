'use client';

import { useEffect, useState } from 'react';
import { FinancePayment } from '@/types/finance';
import { PAYMENT_FIELDS } from '@/constants/fieldConfig';
import FieldInput from '../forms/FieldInput';
import { useIncomesContext } from '@/context/IncomesContext';
import { useModal } from '@/context/ModalContext';
type AddPaymentModalProps = {
  open: boolean;
  sourceId: string; // NEW: pass the source id where payment is being added
  onClose: () => void;
};
function makeBlankPayment(): FinancePayment {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    name: '',
    payment_type: '',
    amount: 0,
    date: '',
    loop: false,
    status: 'coming',
  };
}

export default function AddPaymentModal({ open, onClose, sourceId }: AddPaymentModalProps) {
  const [form, setForm] = useState<FinancePayment>(makeBlankPayment());
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const { addPayment, loading, error } = useIncomesContext();
  const { showModal } = useModal();

  useEffect(() => {
    if (open) {
      setForm(makeBlankPayment());
      setErrors({});
    }
  }, [open]);

  function handleInput(field: keyof FinancePayment, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const err: typeof errors = {};
    if (!form.name) err.name = 'Name required';
    if (!form.payment_type) err.payment_type = 'Type required';
    if (form.amount == null) err.amount = 'Amount required';
    if (!form.date) err.date = 'Date required';
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      // Use context's addPayment for API then state update
      const newPayment = await addPayment(sourceId, form);
      if (newPayment) {
        showModal('Payment added succesfully.');
      }
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-40 p-1">
      <div className="w-full max-w-lg bg-[#989899] rounded-lg shadow-2xl p-4 relative flex flex-col max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#29388A] scrollbar-track-[#989899]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold mb-2 text-[#29388A] text-center">Add Payment</h2>
          {PAYMENT_FIELDS.map((f) => (
            <FieldInput
              key={f.field}
              label={f.label}
              type={f.type}
              enumOptions={f.enumOptions}
              value={form[f.field as keyof FinancePayment]}
              onChange={(v) => handleInput(f.field as keyof FinancePayment, v)}
              err={errors[f.field]}
            />
          ))}
          {error && <div className="text-red-600 text-center">{error}</div>}
          <div className="flex justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#29388A] text-white hover:bg-blue-800 font-semibold"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
