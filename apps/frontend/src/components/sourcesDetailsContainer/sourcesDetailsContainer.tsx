'use client';
import { useState } from 'react';

type SourcesDetailsContainerProps<T extends { id: string }> = {
  header: string;
  items: T[];
  renderSource: (
    item: T,
    open: boolean,
    onClick: () => void,
    onEdit: () => void,
  ) => React.ReactNode;
  onAddSource?: () => void;
};

export default function SourcesDetailsContainer<T extends { id: string }>({
  header,
  items,
  renderSource,
  onAddSource,
}: SourcesDetailsContainerProps<T>) {
  const [openSources, setOpenSources] = useState<{ [id: string]: boolean }>({});

  return (
    <div className="flex flex-col rounded bg-[#989899] opacity-75 items-center gap-2 px-1">
      <h1 className="text-2xl xs:text-3xl text-[#29388A] font-bold">{header}</h1>
      {items.map((item) =>
        renderSource(
          item,
          !!openSources[item.id],
          () =>
            setOpenSources((prev) => ({
              ...prev,
              [item.id]: !prev[item.id],
            })),
          () => setOpenSources((prev) => ({ ...prev, [item.id]: true })),
        ),
      )}
      <div
        className="w-full flex flex-col xs:flex-col border-4 border-[#29388A] rounded mx-2 p-2 cursor-pointer transition-all relative text-2xl xs:text-3xl text-[#1E1552]  font-bold mr-2"
        onClick={onAddSource}
      >
        +Add Income Source
      </div>
    </div>
  );
}
