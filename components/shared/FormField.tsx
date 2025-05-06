"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormFieldProps {
  id: string
  label: string
  type: "text" | "email" | "password" | "tel" | "date" | "textarea" | "select"
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange?: (value: string) => void
  disabled?: boolean
  error?: string
  required?: boolean
  options?: { value: string; label: string }[]
  rows?: number
}

export function FormField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  onSelectChange,
  disabled = false,
  error,
  required = false,
  options = [],
  rows = 3,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          className={error ? "border-red-500" : ""}
          required={required}
        />
      ) : type === "select" ? (
        <Select value={value} onValueChange={onSelectChange} disabled={disabled} required={required}>
          <SelectTrigger id={id} className={error ? "border-red-500" : ""}>
            <SelectValue placeholder={placeholder || "Sélectionner..."} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={error ? "border-red-500" : ""}
          required={required}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
