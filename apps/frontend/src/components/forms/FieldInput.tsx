'use client';

type FieldInputProps = {
  label: string;
  type?: string;
  value: any;
  onChange: (v: any) => void;
  enumOptions?: string[];
  err?: string;
};
/**
 * FieldInput component for rendering form fields with multiple input types.
 *
 * @component
 * @param {FieldInputProps} props - The component props
 * @param {string} props.label - The label text displayed for the form field
 * @param {string} [props.type] - The HTML input type (e.g., 'text', 'number', 'date', 'checkbox'). Defaults to 'text'
 * @param {string | number | boolean} [props.value] - The current value of the input field
 * @param {Function} props.onChange - Callback function triggered when the input value changes
 * @param {string[]} [props.enumOptions] - Array of string options for rendering a select dropdown. When provided, renders a select element instead of a text input
 * @param {string} [props.err] - Error message to display below the input field in red text
 *
 * @returns {JSX.Element} A form field component that adapts based on input type and enumOptions
 *
 * @description
 * The component conditionally renders different input elements:
 * - **Select dropdown**: When `enumOptions` is provided, renders a select element with options from the array
 * - **Checkbox**: When `type` is 'checkbox', renders a checkbox input with label
 * - **Default input**: Renders a standard HTML input with type-specific handling for number, date, and text inputs
 *
 * enumOptions purpose and usage:
 * - **Purpose**: Provides predefined choices for restricted field values (e.g., categories, statuses)
 * - **Goal**: Creates a select dropdown instead of free-form text input to ensure data consistency and prevent invalid entries
 * - **Usage**: Pass an array of valid string values (e.g., ['Income', 'Expense', 'Transfer']), which will be rendered as options the user can choose from
 */
export default function FieldInput({
  label,
  type,
  value,
  onChange,
  enumOptions,
  err,
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
      ></input>
      {err && <span className="text-red-500 text-xs">{err}</span>}
    </label>
  );
}
