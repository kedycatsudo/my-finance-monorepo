'use client';

import React from 'react';
import Image from 'next/image';
import FieldInput from './FieldInput';
import { assetPrefix } from '@/constants/config';

type ItemFieldConfig = {
  field: string;
  label: string;
  type?: string;
  enumOptions?: string[];
};
type AccordionItemProps = {
  item: Record<string, unknown>;
  fieldConfig: ItemFieldConfig[];
  itemTypeKey: string; //payment | item
  isOpen: boolean;
  toggleOpen: () => void;
  handleItemInput: (itemId: string, field: string, value: string | number | boolean) => void;
  errors?: Record<string, unknown>;
  onDelete?: () => void;
  handleItemBlur?: (itemId: string, field: string) => void;
};

//Renders on item(payment/investment) accordion, reusable

export default function AccordionItem({
  item,
  fieldConfig,
  itemTypeKey,
  isOpen,
  toggleOpen,
  handleItemInput,
  errors,
  onDelete,
  handleItemBlur,
}: AccordionItemProps) {
  function getError(
    errors: Record<string, unknown> | undefined,
    itemTypeKey: string,
    itemId: string | number,
    field: string,
  ): string | undefined {
    if (!errors) return undefined;
    const flatKey = `${itemTypeKey}.${itemId}.${field}`;
    if (flatKey in errors) {
      const v = errors[flatKey];
      return v != null ? String(v) : undefined;
    }
    const typeObj = errors[itemTypeKey];
    if (typeObj && typeof typeObj === 'object') {
      const idObj = (typeObj as Record<string | number, unknown>)[itemId];
      if (idObj && typeof idObj === 'object') {
        const v = (idObj as Record<string, unknown>)[field];
        return v != null ? String(v) : undefined;
      }
    }
    return undefined;
  }
  return (
    <div
      className={`border-4 border-[#29388A] rounded px-2 py-2 transition-all cursor-pointer ${isOpen ? 'bg-[#3A4483]/75 text-white' : 'text-[#29388A]'}`}
    >
      <div onClick={toggleOpen} className="flex flex-row justify-between items-center">
        <div className="flex">
          <span> {'name' in item ? String(item.name) : String(item.assetName)}</span>{' '}
          <Image
            onClick={(e) => {
              e.stopPropagation(); // Prevent accidental open/close on edit
              onDelete?.();
            }}
            src={`${assetPrefix}delete.svg`}
            alt="Delete payment button"
            width={30}
            height={30}
            className={`w-7 h- `}
          />{' '}
        </div>
        <span className="text-sm text-gray-500">{isOpen ? '▼' : '▶'}</span>
      </div>{' '}
      {isOpen && (
        <div className="mt-2 flex flex-col gap-2">
          {fieldConfig.map((f) =>
            f.field === 'id' ? null : (
              <FieldInput
                key={f.field}
                label={f.label}
                type={f.type}
                enumOptions={f.enumOptions}
                value={item[f.field] != null ? String(item[f.field]) : ''}
                onChange={(v) => handleItemInput(String(item.id), f.field, v)}
                onBlur={() => handleItemBlur?.(String(item.id), f.field)}
                err={getError(errors, itemTypeKey, String(item.id), f.field)}
              ></FieldInput>
            ),
          )}
        </div>
      )}{' '}
    </div>
  );
}
