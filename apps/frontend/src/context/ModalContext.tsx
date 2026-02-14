// src/context/ModalContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type ModalState = {
  isOpen: boolean;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showConfirm?: boolean;
};

type ModalContextType = {
  modal: ModalState;
  showModal: (message: string) => void;
  showConfirmModal: (message: string, onConfirm: () => void, onCancel: () => void) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    message: '',
    showConfirm: false,
  });

  function showModal(message: string) {
    setModal({ isOpen: true, message, showConfirm: false });
  }
  function showConfirmModal(message: string, onConfirm: () => void, onCancel: () => void) {
    setModal({ isOpen: true, message, showConfirm: true, onConfirm, onCancel });
  }
  function closeModal() {
    setModal({ ...modal, isOpen: false });
  }
  return (
    <ModalContext.Provider value={{ modal, showModal, showConfirmModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside <ModalProvider>');
  return ctx;
}
