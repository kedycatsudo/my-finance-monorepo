'use client';

import { useModal } from '@/context/ModalContext';

export default function AppModal() {
  const { modal, closeModal } = useModal();
  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#989899] rounded p-6 shadow-lg min-w-[250px] text-center mt-24">
        {' '}
        <p className="mb-4">{modal.message}</p>
        {modal.showConfirm ? (
          <div className="flex gap-3 justify-center">
            <button
              className="bg-red-600 text-white p-2 rounded"
              onClick={() => {
                modal.onCancel?.();
                closeModal();
              }}
            >
              Cancel
            </button>
            <button
              className="bg-[#29388A]-600 text-white p-2 rounded hover "
              onClick={() => {
                modal.onConfirm?.();
                closeModal();
              }}
            >
              Confirm
            </button>
          </div>
        ) : (
          <button className="bg-[#18123d] text-white p-2 rounded w-full" onClick={closeModal}>
            OK
          </button>
        )}
      </div>
    </div>
  );
}
