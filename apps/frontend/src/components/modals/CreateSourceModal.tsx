'use client';
import { useEffect, useState } from 'react';

export type SourceBase = {
  id: string;
  sourceName: string;
  description?: string;
  date?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (source: Omit<SourceBase, 'id'>) => void;
};

export default function CreateSourceModal({ open, onClose, onSubmit }: Props) {
  const [fields, setFields] = useState<Omit<SourceBase, 'id'>>({
    sourceName: '',
    description: '',
    date: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setFields({ sourceName: '', description: '', date: '' });
      setError('');
    }
  }, [open]);

  if (!open) return null;

  function handleChange(field: keyof Omit<SourceBase, 'id'>, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.sourceName.trim()) {
      setError('Source Name is required');
      return;
    }
    onSubmit(fields);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-40 p-1">
      <div className="w-full max-w-lg bg-[#989899] rounded-lg shadow-2xl p-4 relative flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold mb-2 text-[#29388A] text-center">Add Source</h2>
          <label>
            <span className="block">Source Name*</span>
            <input
              type="text"
              value={fields.sourceName}
              onChange={(e) => handleChange('sourceName', e.target.value)}
              required
              className="rounded border px-2 py-1 mt-1 w-full text-black"
            />
          </label>
          <label>
            <span className="block">Description</span>
            <input
              type="text"
              value={fields.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="rounded border px-2 py-1 mt-1 w-full text-black"
            />
          </label>
          <label>
            <span className="block">Date</span>
            <input
              type="date"
              value={fields.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="rounded border px-2 py-1 mt-1 w-full text-black"
            />
          </label>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
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
