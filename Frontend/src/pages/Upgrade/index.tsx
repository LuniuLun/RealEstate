import { Container, Flex, Heading, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { PricingCard, WarningModal } from '@components'
import { PRICINGPLANS } from '@constants/pricingPlans'
import { useVNPayMutation } from '@hooks'
import { authStore } from '@stores'
import { RoleName } from '@type/models'
import { KindOfUpgradePackage, PricingPlan } from '@type/upgradePackage'
import { FormEvent, useState } from 'react'

const Upgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [availablePurchase, setAvailablePurchase] = useState(false)
  const [message, setMessage] = useState<string>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { paymentMutation } = useVNPayMutation()
  const { token } = authStore()
  const roleValue = token?.user?.role?.name

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan)

    if (roleValue === RoleName.CUSTOMER && plan.id === KindOfUpgradePackage.BASIC) {
      setAvailablePurchase(true)
      setMessage(undefined)
    } else {
      setAvailablePurchase(false)
      if (roleValue !== RoleName.CUSTOMER) {
        setMessage(`Tài khoản của bạn đã được nâng cấp lên gói ${plan.title} hoặc cao hơn`)
      }
    }
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
        title={availablePurchase ? 'Xác nhận nâng cấp' : 'Thông báo'}
        message={
          message ??
          `Bạn chắc chắn nâng cấp tài khoản với ${selectedPlan?.title} có giá ${selectedPlan?.price.amount.toLocaleString()} VND không?`
        }
        handleSubmit={
          availablePurchase
            ? handleConfirmUpgrade
            : (e) => {
                e.preventDefault()
                onClose()
              }
        }
        isSubmitting={paymentMutation.isPending}
      />
    </Container>
  )
}

export default Upgrade
