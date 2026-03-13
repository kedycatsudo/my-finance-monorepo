'use client';

import { useEffect, useState } from 'react';
import { FinancePayment } from '@/types/finance';
import { PAYMENT_FIELDS } from '@/constants/fieldConfig';
import FieldInput from '../forms/FieldInput';
import { useIncomesContext } from '@/context/IncomesContext';
import { useModal } from '@/context/ModalContext';
import { useOutcomesContext } from '@/context/OutcomesContext';
type AddPaymentModalProps = {
  open: boolean;
  sourceType: 'income' | 'outcome' | 'default';
  sourceId: string; // NEW: pass the source id where payment is being added
  onClose: () => void;
  onPaymentAdded?: (payment: FinancePayment) => void; // Callback after successful payment add
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

export default function AddPaymentModal({
  open,
  onClose,
  sourceId,
  onPaymentAdded,
  sourceType,
}: AddPaymentModalProps) {
  const [form, setForm] = useState<FinancePayment>(makeBlankPayment());
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const { addPaymentToIncomes, loading, error } = useIncomesContext();
  const { addPaymentToOutcomes } = useOutcomesContext();
  const { showModal } = useModal();
  function resetLocalState() {
    setForm(makeBlankPayment());
    setErrors({});
  }
  function handleClose() {
    resetLocalState();
    onClose();
  }
  useEffect(() => {
    if (!open) return;
  }, [open]);
  function getFieldValue(field: keyof FinancePayment): string {
    const v = form[field];
    return typeof v === 'string' ? v : String(v ?? '');
  }
  function handleInput(field: keyof FinancePayment, value: string | number | boolean) {
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
    if (!validate()) return;

    if (sourceType === 'outcome') {
      const newPayment = await addPaymentToOutcomes(sourceId, form);
      if (newPayment) {
        onPaymentAdded?.(newPayment);
        showModal('Payment added successfully.');
        handleClose();
      }
      return;
    }
    if (!open) return null;
    if (sourceType === 'income') {
      const newPayment = await addPaymentToIncomes(sourceId, form);
      if (newPayment) {
        onPaymentAdded?.(newPayment);
        showModal('Paymend added succusfully.');
        handleClose();
      }
      return;
    }
    showModal('Invalid source type');
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
              value={getFieldValue(f.field as keyof FinancePayment)}
              onChange={(v) => handleInput(f.field as keyof FinancePayment, v)}
              err={errors[f.field]}
            />
          ))}
          {error && <div className="text-red-600 text-center">{error}</div>}
          <div className="flex justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
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
