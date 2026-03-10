'use client';

import { useEffect, useState } from 'react';
import { FinancePayment, FinanceSource } from '@/types/finance';
import { InvestmentSource, InvestmentItem } from '@/types/investments';
import { PAYMENT_FIELDS, ITEM_FIELDS } from '@/constants/fieldConfig';
import FieldInput from '../forms/FieldInput';
import AccordionItem from '../forms/AccordionItem';
import { isFinanceSource, isInvestmentSource } from '@/utils/functions/typeGuard';
import AddInvestmentItemModal from './AddInvestmentItem';
import AddPaymentModal from './AddFinanceItem';
import { useIncomesContext } from '@/context/IncomesContext';
import { useOutcomesContext } from '@/context/OutcomesContext';
import { useInvestmentsContext } from '@/context/InvestmentContext';
import { useModal } from '@/context/ModalContext';
type EditSourceModalProps = {
  open: boolean;
  source: FinanceSource | InvestmentSource;
  onClose: () => void;
  onSubmit: (updated: FinanceSource | InvestmentSource) => void;
};

export default function EditSourceModal({ open, source, onClose, onSubmit }: EditSourceModalProps) {
  const [localSource, setLocalSource] = useState<FinanceSource | InvestmentSource>(source);
  const [openItemAccordions, setOpenItemAccordions] = useState<{ [id: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [field: string]: string }>({});
  const [showAppModal, setShowAppModal] = useState<boolean | null>(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddInvestmentItemModal, setShowAddInvestmentItemModal] = useState(false);
  const { showModal, showConfirmModal, closeModal } = useModal();
  const { removeIncomePayment } = useIncomesContext();
  const { removeOutcomePayment } = useOutcomesContext();
  const { addItem, updateItem, removeItem } = useInvestmentsContext();
  // Sync localSource when payment is added

  useEffect(() => {
    setLocalSource(source);
    setOpenItemAccordions({});
    setErrors({});
  }, [source, open]);

  const handleInvestmentItemAdded = async (newItem: InvestmentItem) => {
    if (!isInvestmentSource(localSource)) return;
    const payload = {
      assetName: newItem.assetName,
      term: newItem.term,
      investedAmount: Number(newItem.investedAmount),
      entryDate: newItem.entryDate,
      exitDate: newItem.exitDate || null,
      result: newItem.result,
      resultAmount: newItem.resultAmount,
      status: newItem.status,
    };
    const created = await addItem(localSource.id, payload);
    if (!created) return;
    // Keep modal in sync with backend-created item (real id)

    setLocalSource((prev) =>
      isInvestmentSource(prev)
        ? {
            ...prev,
            items: prev.items.some((i) => i.id === created.id)
              ? prev.items
              : [...prev.items, created],
          }
        : prev,
    );
  };
  const handlePaymentAdded = (created: FinancePayment) => {
    setLocalSource((prev) =>
      isFinanceSource(prev)
        ? {
            ...prev,
            finance_payments: prev.finance_payments.some((p) => p.id === created.id)
              ? prev.finance_payments
              : [...prev.finance_payments, created],
          }
        : prev,
    );
  };

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleSourceInput = (field: string, value: any) => {
    setLocalSource((prev) => ({ ...prev, [field]: value }) as any);
  };
  const handleItemInput = async (itemId: string, field: string, value: any) => {
    if (isFinanceSource(localSource)) {
      setLocalSource((prev) =>
        isFinanceSource(prev)
          ? {
              ...prev,
              finance_payments: prev.finance_payments.map((itm) =>
                itm.id === itemId ? { ...itm, [field]: value } : itm,
              ),
            }
          : prev,
      );
      return;
    }
    if (isInvestmentSource(localSource)) {
      setLocalSource((prev) =>
        isInvestmentSource(prev)
          ? {
              ...prev,
              items: prev.items.map((itm) =>
                itm.id === itemId ? { ...itm, [field]: value } : itm,
              ),
            }
          : prev,
      );
    }
  };

  function validate() {
    const err: Record<string, string> = {};
    if (!localSource.name?.trim()) err.name = 'Source name required';

    if (isFinanceSource(localSource)) {
      for (const payment of localSource.finance_payments ?? []) {
        if ('name' in payment && typeof payment.name === 'string' && !payment.name?.trim()) {
          err[`payment.${payment.id}.name`] = 'Name is required';
        }
      }
    } else if (isInvestmentSource(localSource)) {
      for (const item of localSource.items ?? []) {
        if ('assetName' in item && typeof item.assetName === 'string' && !item.assetName?.trim()) {
          err[`item.${item.id}.assetName`] = 'Asset name required';
        }
      }
    }
    setErrors(err);

    return Object.keys(err).length === 0;
  }
  const handleSubmit = async () => {
    if (!validate()) return;

    // For investment source: persist all item edits now (single submit flow)
    if (isInvestmentSource(localSource)) {
      for (const item of localSource.items ?? []) {
        await updateItem(localSource.id, item.id, {
          assetName: item.assetName,
          term: item.term,
          investedAmount: item.investedAmount,
          entryDate: item.entryDate,
          exitDate: item.exitDate,
          result: item.result,
          resultAmount: item.resultAmount,
          status: item.status,
        });
      }
    }

    // Keep your existing source-level submit behavior
    await onSubmit?.(localSource);
    onClose();
    setShowAppModal(true);
  };
  const sourceFields = [
    {
      label: ' Source Name',
      field: 'name',
      value: localSource.name,
      err: errors.name,
    },
    ...(localSource.description !== undefined
      ? [{ label: 'Description', field: 'description', value: localSource.description }]
      : []),
    ...(localSource.date !== undefined
      ? [{ label: 'Date', field: 'date', value: localSource.date, type: 'date' }]
      : []),
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-40 p-1">
      <div
        className="w-full max-w-lg bg-[#989899] rounded-lg shadow-2xl p-4 relative max-h-[90vh] flex flex-col
        sm:max-w-full sm:rounded-none sm:h-full sm:justify-end sm:p-2"
      >
        <div className="overflow-y-auto flex-1 gap-3 flex flex-col">
          <h2 className="text-2xl font-bold mb-2 text-[#29388A] text-center">
            Edit {localSource.name}
          </h2>
          <div className="flex flex-col gap-2 mb-4">
            {sourceFields.map((f) => (
              <FieldInput
                key={f.field}
                label={f.label}
                type={f.type}
                value={f.value}
                onChange={(v) => handleSourceInput(f.field ?? '', v)}
                err={f.err}
              />
            ))}
          </div>
          {/* items grid */}
          {isFinanceSource(localSource) &&
            localSource.finance_payments &&
            localSource.finance_payments.map((payment) => (
              <AccordionItem
                key={payment.id}
                item={payment}
                fieldConfig={PAYMENT_FIELDS}
                itemTypeKey="payment"
                isOpen={!!openItemAccordions[payment.id]}
                onDelete={() => {
                  showConfirmModal(
                    'Please confirm that selected source will be deleted with the payments attached.',
                    async () => {
                      if (localSource.type === 'income') {
                        const ok = await removeIncomePayment(source.id, payment.id);
                        closeModal();
                        if (ok ?? null) showModal('Payment deleted successfully.');
                      }
                      if (localSource.type === 'outcome') {
                        const ok = await removeOutcomePayment(source.id, payment.id);
                        closeModal();
                        if (ok ?? null) showModal('Payment deleted succesfully.');
                      }
                    },
                    () => closeModal(),
                  );
                }}
                toggleOpen={() =>
                  setOpenItemAccordions((prev) => ({
                    ...prev,
                    [payment.id]: !prev[payment.id],
                  }))
                }
                handleItemInput={handleItemInput}
                errors={errors}
              />
            ))}
          {isInvestmentSource(localSource) &&
            localSource.items &&
            localSource.items.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                fieldConfig={ITEM_FIELDS}
                itemTypeKey="item"
                isOpen={!!openItemAccordions[item.id]}
                onDelete={async () => {
                  const ok = await removeItem(source.id, item.id);
                  if (ok) {
                    setLocalSource((prev) =>
                      isInvestmentSource(prev)
                        ? { ...prev, items: prev.items.filter((i) => i.id !== item.id) }
                        : prev,
                    );
                  }
                }}
                toggleOpen={() =>
                  setOpenItemAccordions((prev) => ({
                    ...prev,
                    [item.id]: !prev[item.id],
                  }))
                }
                handleItemInput={handleItemInput}
                errors={errors}
              />
            ))}
        </div>
        {/* + Add Income Payment button & modal */}
        {isFinanceSource(localSource) && (
          <>
            <div
              className="border-4 border-[#29388A] rounded px-2 py-2 transition-all cursor-pointer text-[#29388A] mt-3"
              onClick={() => setShowAddPaymentModal(true)}
            >
              + Add Item
            </div>
            <AddPaymentModal
              open={showAddPaymentModal}
              onClose={() => setShowAddPaymentModal(false)}
              sourceId={localSource.id}
              sourceType={localSource.type}
              onPaymentAdded={handlePaymentAdded}
            />
          </>
        )}
        {/* + Add Investment Item button & modal */}
        {isInvestmentSource(localSource) && (
          <>
            <div
              className="border-4 border-[#29388A] rounded px-2 py-2 transition-all cursor-pointer text-[#29388A] mt-3"
              onClick={() => setShowAddInvestmentItemModal(true)}
            >
              + Add Investment Item
            </div>
            <AddInvestmentItemModal
              open={showAddInvestmentItemModal}
              onClose={() => setShowAddInvestmentItemModal(false)}
              sourceId={localSource.id}
              onItemAdded={(created) => {
                setLocalSource((prev) =>
                  isInvestmentSource(prev)
                    ? {
                        ...prev,
                        items: prev.items.some((i) => i.id === created.id)
                          ? prev.items
                          : [...prev.items, created],
                      }
                    : prev,
                );
              }}
            />
          </>
        )}
        <div className="flex justify-end gap-2 mt-4 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-[#29388A] text-white hover:bg-blue-800 font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
