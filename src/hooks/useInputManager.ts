import { useState } from 'react'

type ValidationRule = {
  required?: boolean
  minLength?: number
  pattern?: RegExp
  message?: string
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule
}

type ValidationErrors<T> = {
  [K in keyof T]?: string
}

export function useInputManager<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors<T>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, values[name])
  }

  const validateField = (name: keyof T, value: any): boolean => {
    const rules = validationRules?.[name]
    if (!rules) return true

    let error: string | undefined

    if (rules.required && (!value || value.toString().trim() === '')) {
      error = rules.message || 'Este campo é obrigatório'
    } else if (rules.minLength && value && value.toString().length < rules.minLength) {
      error = rules.message || `Mínimo de ${rules.minLength} caracteres`
    } else if (rules.pattern && value && !rules.pattern.test(value.toString())) {
      error = rules.message || 'Formato inválido'
    }

    setErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }

  const validateAll = (): boolean => {
    let isValid = true
    const newErrors: ValidationErrors<T> = {}

    Object.keys(initialValues).forEach(key => {
      const fieldKey = key as keyof T
      if (!validateField(fieldKey, values[fieldKey])) {
        isValid = false
      }
    })

    return isValid
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  const hasError = (name: keyof T): boolean => {
    return touched[name as string] && !!errors[name]
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    hasError,
    isValid: Object.keys(errors).length === 0
  }
}
