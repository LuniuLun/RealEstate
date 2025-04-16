import { Container, Flex, Heading, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { PricingCard, WarningModal } from '@components'
import { PRICINGPLANS } from '@constants/pricingPlans'
import { useVNPayMutation } from '@hooks'
import { PricingPlan } from '@type/upgradePackage'
import { FormEvent, useState } from 'react'

const Upgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { paymentMutation } = useVNPayMutation()

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    onOpen()
  }

  const handleConfirmUpgrade = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedPlan) return

    paymentMutation.mutate({
      amount: selectedPlan.price.amount,
      orderInfo: `Mua gói ${selectedPlan.title}`,
      vnpReturnUrl: 'http://localhost:5173/personal/transactions'
    })
  }

  return (
    <Container maxW='container.xl' py={12}>
      <VStack spacing={8} align='center'>
        <Heading size='xl' textAlign='center'>
          Nhiều lựa chọn gói theo nhu cầu của bạn
        </Heading>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={6} w='full' justify='center' align='stretch'>
          {PRICINGPLANS.map((plan) => (
            <PricingCard key={plan.id} {...plan} onSelect={() => handleSelectPlan(plan)} />
          ))}
        </Flex>

        <Text fontSize='sm' color='gray.500' mt={8}>
          Giá ưu đãi dành cho các gói dịch vụ đăng tin trọn gói so với việc đăng tin lẻ từng tin.
        </Text>
      </VStack>

      <WarningModal
        isModalOpen={isOpen}
        onClose={onClose}
        title='Xác nhận nâng cấp'
        message={`Bạn chắc chắn nâng cấp tài khoản với ${selectedPlan?.title} có giá ${selectedPlan?.price.amount.toLocaleString()} VND không?`}
        handleSubmit={handleConfirmUpgrade}
        isSubmitting={paymentMutation.isPending}
      />
    </Container>
  )
}

export default Upgrade
