import { Select, SelectProps } from '@chakra-ui/react'
import { useState, useEffect, memo } from 'react'
import React, { forwardRef } from 'react'

export interface ISelectOption<T> {
  value: T
  label: string
}

interface ICustomSelectProps<T> extends SelectProps {
  options: ISelectOption<T>[]
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const CustomSelect = forwardRef<HTMLSelectElement, ICustomSelectProps<string | number>>(
  ({ options, placeholder, value, onChange, sx, ...props }: ICustomSelectProps<string | number>, ref) => {
    const [selectedValue, setSelectedValue] = useState<string | number>('')

    useEffect(() => {
      if (value) {
        setSelectedValue(value)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      setSelectedValue(value)
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <Select
        ref={ref}
        fontSize='sm'
        fontWeight='medium'
        value={selectedValue}
        onChange={handleChange}
        borderRadius={20}
        cursor='pointer'
        borderColor='brand.sliver'
        sx={{
          width: 'auto',
          _hover: { bgColor: 'brand.hoverBtnColor', borderColor: 'brand.hoverBtnColor', color: 'brand.white' },
          ...sx
        }}
        {...props}
      >
        <option value='' disabled hidden>
          {selectedValue || placeholder || 'Select'}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    )
  }
)

export default memo(CustomSelect)
