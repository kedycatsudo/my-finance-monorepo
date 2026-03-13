'use client';

type FieldInputProps = {
  label: string;
  type?: string;
  value: string | number | null | undefined;
  onChange: (v: string | number | boolean) => void;
  enumOptions?: string[];
  err?: string;
  onBlur?: () => void;
};

export default function FieldInput({
  label,
  type,
  value,
  onChange,
  enumOptions,
  err,
  onBlur,
}: FieldInputProps) {
  const toDateInputValue = (dateValue: string | Date | null | undefined) => {
    if (!dateValue) return '';
    if (dateValue instanceof Date) return dateValue.toISOString().slice(0, 10);
    const raw = String(dateValue);
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toISOString().slice(0, 10);
  };

  if (enumOptions)
    return (
      <label className="block">
        {' '}
        <span className="block">{label}</span>
        <select
          value={value === null ? undefined : value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="rounded border px-2 py-1 mt-1 w-full text-black"
        >
          <option value="" disabled>
            Select {label}
          </option>
          {enumOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {err && <span className="text-red-500 text-xs">{err}</span>}
      </label>
    );
  if (type === 'checkbox')
    return (
      <label className="flex items-center gap-1">
        {' '}
        <span className="block">{label}</span>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
        ></input>
      </label>
    );
  return (
    <label className="block">
      <span className="block"></span>
      {label}
      <input
        type={type || 'text'}
        value={
          type === 'date' ? toDateInputValue(value === null ? '' : String(value)) : (value ?? '')
        }
        onChange={(e) =>
          onChange(
            type === 'number'
              ? Number(e.target.value)
              : type === 'checkbox'
                ? e.target.checked
                : e.target.value,
          )
        }
        className="rounded border px-2 py-1 mt-1 w-full text-black"
        onBlur={onBlur}
      ></input>
      {err && <span className="text-red-500 text-xs">{err}</span>}
    </label>
  );
}
