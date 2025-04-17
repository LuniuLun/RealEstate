import { memo } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Flex,
  TableCaption,
  TableProps,
  Heading,
  Box,
  Skeleton
} from '@chakra-ui/react'
import { BinIcon, PenIcon } from '@assets/icons'
import FAKE_TABLE_DATA from '@constants/fakeTable'
import CustomCell from './CustomCell'

export interface ITableRow {
  [key: string]: string | number | boolean | Date | React.ReactNode
}

interface ICustomTableProps extends TableProps {
  title?: string
  data: ITableRow[] | undefined
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  isLoaded?: boolean
}

const CustomTable = ({ isLoaded, title, data, onEdit, onDelete, ...props }: ICustomTableProps) => {
  if (!data || (data.length === 0 && isLoaded)) {
    return (
      <Heading variant='secondary' color='brand.red' textAlign='center' mt={10}>
        Dữ liệu không tồn tại
      </Heading>
    )
  }

  const headers = data.length ? Object.keys(data[0]) : Object.keys(FAKE_TABLE_DATA[0])
  const filteredHeaders = headers.filter((header) => header !== 'id')

  const tableData = data.length ? data : FAKE_TABLE_DATA

  const hasActions = Boolean(onEdit || onDelete)

  return (
    <Box overflowX='auto' maxH='500px' overflowY='auto'>
      <Table borderRadius='lg' {...props} position='relative'>
        {title && (
          <TableCaption
            position='sticky'
            top={0}
            zIndex={1}
            placement='top'
            marginTop={0}
            padding={5}
            height={16}
            textAlign='left'
            color='brand.blackTextPrimary'
            fontSize='1.0625rem'
            fontWeight='bold'
            bgColor='brand.white'
          >
            {title}
          </TableCaption>
        )}
        <Thead>
          <Tr bgColor='brand.secondary'>
            {filteredHeaders.map((header, index) => (
              <Th
                position='sticky'
                top={16}
                key={header}
                borderBottom='2px solid'
                borderColor='brand.secondary'
                padding={5}
                minW='150px'
                fontSize='md'
                textTransform='capitalize'
                textAlign={index === 0 ? 'left' : 'center'}
                color='brand.blackTextSecondary'
                bgColor='brand.secondary'
              >
                <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300'>
                  {header.replace(/([a-z])([A-Z])/g, '$1 $2')}
                </Skeleton>
              </Th>
            ))}
            {hasActions && (
              <Th
                position='sticky'
                top={16}
                zIndex={1}
                textAlign='center'
                minW='150px'
                padding={5}
                fontSize='md'
                textTransform='capitalize'
                borderBottom={`2px solid $'brand.secondary'`}
                color='brand.blackTextSecondary'
                bgColor='brand.secondary'
              >
                <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300'>
                  Action
                </Skeleton>
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((row, rowIndex) => (
            <Tr key={rowIndex} fontSize='sm' color='brand.blackTextPrimary'>
              {filteredHeaders.map((header, index) => (
                <Td
                  key={header}
                  borderBottom={`2px solid $'brand.secondary'`}
                  maxW='200px'
                  textAlign={index === 0 ? 'left' : 'center'}
                  bgColor='brand.white'
                >
                  <Skeleton
                    isLoaded={isLoaded}
                    startColor='gray.100'
                    endColor='gray.300'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    whiteSpace='nowrap'
                  >
                    <CustomCell header={header} row={row} />
                  </Skeleton>
                </Td>
              ))}
              {hasActions && (
                <Td minW='150px' borderBottom={`2px solid $'brand.secondary'`} bgColor='brand.white'>
                  <Skeleton isLoaded={isLoaded} startColor='gray.100' endColor='gray.300'>
                    <Flex gap={2} justifyContent='center'>
                      {onEdit && (
                        <IconButton
                          aria-label='edit-user-btn'
                          bgColor='brand.white'
                          icon={<PenIcon />}
                          size='sm'
                          onClick={() => onEdit && onEdit(row.id as number)}
                        />
                      )}
                      {onDelete && (
                        <IconButton
                          aria-label='delete-user-btn'
                          bgColor='brand.white'
                          _hover={{
                            bgColor: 'brand.red'
                          }}
                          icon={<BinIcon />}
                          size='sm'
                          colorScheme='red'
                          onClick={() => onDelete && onDelete(row.id as number)}
                        />
                      )}
                    </Flex>
                  </Skeleton>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default memo(CustomTable)
