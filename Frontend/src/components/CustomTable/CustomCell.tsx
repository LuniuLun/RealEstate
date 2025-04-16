import { Checkbox, Flex } from '@chakra-ui/react'
import { ITableRow } from '.'
import { memo } from 'react'

interface ICustomCellProps {
  header: string
  row: ITableRow
}

const CustomCell = ({ header, row }: ICustomCellProps) => {
  const value = row[header]

  if (typeof value === 'boolean') {
    return <Checkbox isChecked={value} disabled aria-label={`Cell active status for ${row.name}`} />
  }

  if (!value) return ''

  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }

  const lowerHeader = header.toLowerCase()

  if (lowerHeader === 'role') {
    const isAdmin = value?.toString().toLowerCase().includes('admin')

    return (
      <Flex
        justifyContent='center'
        borderRadius='md'
        margin={lowerHeader === 'role' ? 'auto' : 'unset'}
        w='130px'
        py='6px'
        fontWeight='semibold'
        color={isAdmin ? 'brand.white' : 'brand.blackTextSecondary'}
        bgColor={isAdmin ? 'brand.hoverBtnColor' : 'brand.secondary'}
      >
        {value}
      </Flex>
    )
  }

  return value
}

export default memo(CustomCell)
