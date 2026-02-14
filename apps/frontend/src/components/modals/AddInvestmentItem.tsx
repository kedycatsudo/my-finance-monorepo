'use client';

import { useEffect, useState } from 'react';
import { InvestmentItem } from '@/types/investments';
import { ITEM_FIELDS } from '@/constants/fieldConfig';
import FieldInput from '../forms/FieldInput';

type AddInvestmentItemModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: InvestmentItem) => void;
};

function makeBlankInvestmentItem(): InvestmentItem {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    assetName: '',
    term: 'short',
    investedAmount: 0,
    entryDate: '',
    exitDate: '',
    result: 'none',
    resultAmount: null,
    status: 'open',
  };
}

export default function AddInvestmentItemModal({
  open,
  onClose,
  onSubmit,
}: AddInvestmentItemModalProps) {
  const [form, setForm] = useState<InvestmentItem>(makeBlankInvestmentItem());
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    if (open) {
      setForm(makeBlankInvestmentItem());
      setErrors({});
    }
  }, [open]);

  function handleInput(field: keyof InvestmentItem, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const err: typeof errors = {};
    if (!form.assetName) err.assetName = 'Asset name required';
    if (!form.term) err.term = 'Term required';
    if (form.investedAmount === null) err.investedAmount = 'Amount required';
    if (!form.entryDate) err.entryDate = 'Entry date required';
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-40 p-1">
      <div className="w-full max-w-lg bg-[#989899] rounded-lg shadow-2xl p-4 relative flex flex-col overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold mb-2 text-[#29388A] text-center">
            Add Investment Item
          </h2>
          {ITEM_FIELDS.map((f) => (
            <FieldInput
              key={f.field}
              label={f.label}
              type={f.type}
              enumOptions={f.enumOptions}
              value={form[f.field as keyof InvestmentItem]}
              onChange={(v) => handleInput(f.field as keyof InvestmentItem, v)}
              err={errors[f.field]}
            />
          ))}
          <div className="flex justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#29388A] text-white hover:bg-blue-800 font-semibold"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
