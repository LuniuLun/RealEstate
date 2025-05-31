import { memo } from 'react'
import { Box, Flex, Heading, Text, CardHeader, CardBody } from '@chakra-ui/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@utils'
import { CustomSelect } from '@components'
import colors from '@styles/variables/colors'
import { VIEW_MODE_CHART_OPTION } from '@constants/option'

export type ViewMode = 'weekly' | 'monthly'

interface ForecastDataItem {
  date: string
  'Giá dự đoán': number
}

interface ForecastChartProps {
  district: string
  periodDays: number
  chartData: ForecastDataItem[]
  minY: number
  maxY: number
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

const ForecastChart = ({
  district,
  periodDays,
  chartData,
  minY,
  maxY,
  viewMode,
  onViewModeChange
}: ForecastChartProps) => {
  const yMargin = (maxY - minY) * 0.3
  const yMin = Math.max(0, minY - yMargin)
  const yMax = maxY + yMargin

  return (
    <>
      <CardHeader borderBottom='1px solid' borderColor='brand.sliver'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Box>
            <Heading size='md' color='brand.blackTextPrimary'>
              Kết Quả Dự Báo - {district}
            </Heading>
            <Text color='brand.blackTextSecondary'>Dự báo trong {periodDays} ngày tới</Text>
          </Box>
          <Flex>
            <CustomSelect
              options={VIEW_MODE_CHART_OPTION}
              placeholder='Hiển thị theo'
              value={viewMode}
              onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
            />
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Box h='400px'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' stroke={colors.brand.sliver} />

              <XAxis
                tickMargin={10}
                dataKey='date'
                tick={{ fill: colors.brand.blackTextTertiary }}
                tickLine={{ stroke: colors.brand.blackTextTertiary }}
                axisLine={{ stroke: colors.brand.blackTextTertiary }}
              />

              <YAxis
                domain={[yMin, yMax]}
                width={100}
                tickFormatter={(value) => `${formatCurrency(value)} Tỷ`}
                tick={{ fill: colors.brand.blackTextTertiary }}
                tickLine={{ stroke: colors.brand.blackTextTertiary }}
                axisLine={{ stroke: colors.brand.blackTextTertiary }}
              />

              <Tooltip
                formatter={(value) => `${formatCurrency(Number(value))} Tỷ`}
                contentStyle={{
                  backgroundColor: colors.brand.secondary,
                  color: 'brand.blackTextPrimary',
                  border: '1px solid',
                  borderColor: colors.brand.sliver
                }}
              />

              <Legend wrapperStyle={{ color: 'brand.blackTextPrimary' }} />

              <Line
                type='monotone'
                dataKey='Giá dự đoán'
                stroke={colors.brand.hoverBtnColor}
                dot={false}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardBody>
    </>
  )
}

export default memo(ForecastChart)
