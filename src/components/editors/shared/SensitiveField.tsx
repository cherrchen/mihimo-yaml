import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface SensitiveFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  className?: string
}

export function SensitiveField({ value, onChange, label, placeholder, className }: SensitiveFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className={`flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs pr-8 ${className || ''}`}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      </button>
    </div>
  )
}
