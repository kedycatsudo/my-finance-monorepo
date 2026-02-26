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
  item: Record<string, any>;
  fieldConfig: ItemFieldConfig[];
  itemTypeKey: string; //payment | item
  isOpen: boolean;
  toggleOpen: () => void;
  handleItemInput: (itemId: string, field: string, value: any) => void;
  errors?: Record<string, any>;
  onDelete?: () => void;
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
}: AccordionItemProps) {
  function getError(
    errors: Record<string, any> | undefined,
    itemTypeKey: string,
    itemId: string | number,
    field: string,
  ) {
    if (!errors) return undefined;
    const flatKey = `${itemTypeKey}.${itemId}.${field}`;
    if (flatKey in errors) return errors[flatKey];
    const typeObj = errors[itemTypeKey];
    if (typeObj && typeof typeObj === 'object') {
      const idObj = typeObj[itemId];
      if (idObj && typeof idObj === 'object') return idObj[field];
    }
    return undefined;
  }
  return (
    <div
      className={`border-4 border-[#29388A] rounded px-2 py-2 transition-all cursor-pointer ${isOpen ? 'bg-[#3A4483]/75 text-white' : 'text-[#29388A]'}`}
    >
      <div onClick={toggleOpen} className="flex flex-row justify-between items-center">
        <div className="flex">
          <span> {'name' in item ? item.name : item.assetName}</span>{' '}
          <Image
            onClick={(e) => {
              e.stopPropagation(); // Prevent accidental open/close on edit
              onDelete();
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
                value={item[f.field]}
                onChange={(v) => handleItemInput(item.id, f.field, v)}
                err={getError(errors, itemTypeKey, item.id, f.field)}
              ></FieldInput>
            ),
          )}
        </div>
      )}{' '}
    </div>
  );
}
