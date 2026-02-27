'use client';

type FieldInputProps = {
  label: string;
  type?: string;
  value: any;
  onChange: (v: any) => void;
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
  if (enumOptions)
    return (
      <label className="block">
        {' '}
        <span className="block">{label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded border px-2 py-1 mt-1 w-full text-black"
        >
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
        ></input>
      </label>
    );
  return (
    <label className="block">
      <span className="block"></span>
      {label}
      <input
        type={type || 'text'}
        value={type === 'date' && value ? String(value).slice(0, 10) : (value ?? '')}
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
