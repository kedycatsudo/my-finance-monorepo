'use client';

import { useState } from 'react';
import { InvestmentItem } from '@/types/investments';
import { ITEM_FIELDS } from '@/constants/fieldConfig';
import FieldInput from '../forms/FieldInput';
import { useInvestmentsContext } from '@/context/InvestmentContext';
import { useModal } from '@/context/ModalContext';

type AddInvestmentItemModalProps = {
  open: boolean;
  onClose: () => void;
  sourceId: string;
  onItemAdded?: (item: InvestmentItem) => void;
};

function makeBlankInvestmentItem(): Omit<InvestmentItem, 'id'> {
  return {
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
  sourceId,
  onItemAdded,
}: AddInvestmentItemModalProps) {
  const [form, setForm] = useState<Omit<InvestmentItem, 'id'>>(makeBlankInvestmentItem());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addItem, loading, error } = useInvestmentsContext();
  const { showModal } = useModal();

  function resetLocalState() {
    setForm(makeBlankInvestmentItem());
    setErrors({});
  }

  function handleClose() {
    resetLocalState();
    onClose();
  }

  function handleInput(field: keyof Omit<InvestmentItem, 'id'>, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const err: Record<string, string> = {};

    if (!form.assetName?.trim()) err.assetName = 'Asset name required';
    if (!form.term) err.term = 'Term required';
    if (!Number.isFinite(form.investedAmount)) err.investedAmount = 'Valid amount required';
    if (!form.entryDate) err.entryDate = 'Entry date required';

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: Omit<InvestmentItem, 'id'> = {
      ...form,
      investedAmount: Number(form.investedAmount),
      exitDate: form.exitDate || null,
      resultAmount:
        form.resultAmount === null || form.resultAmount === undefined
          ? null
          : Number(form.resultAmount),
    };

    const created = await addItem(sourceId, payload);

    if (!created) {
      showModal('Failed to add investment item.');
      return;
    }

    onItemAdded?.(created);
    showModal('Investment item added successfully.');
    handleClose();
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
              value={form[f.field as keyof Omit<InvestmentItem, 'id'>]}
              onChange={(v) => handleInput(f.field as keyof Omit<InvestmentItem, 'id'>, v)}
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
