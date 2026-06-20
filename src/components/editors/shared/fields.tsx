interface TextFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TextField({ value, onChange, placeholder, disabled, className }: TextFieldProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ${className || ''}`}
    />
  )
}

interface NumberFieldProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
  placeholder?: string
  min?: number
  max?: number
  disabled?: boolean
  className?: string
}

export function NumberField({ value, onChange, placeholder, min, max, disabled, className }: NumberFieldProps) {
  return (
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => {
        const v = e.target.value
        onChange(v === '' ? undefined : Number(v))
      }}
      placeholder={placeholder}
      min={min}
      max={max}
      disabled={disabled}
      className={`flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ${className || ''}`}
    />
  )
}

interface SelectFieldProps {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
  emptyPlaceholder?: string
  disabled?: boolean
}

export function SelectField({ value, onChange, options, placeholder, emptyPlaceholder, disabled }: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
      {emptyPlaceholder && <option value="" disabled hidden>{emptyPlaceholder}</option>}
      {!emptyPlaceholder && placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}

interface BoolFieldProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export function BoolField({ value, onChange, disabled }: BoolFieldProps) {
  return (
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="size-4 rounded border-input"
    />
  )
}
