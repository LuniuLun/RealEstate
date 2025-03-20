import React from 'react'
import { Alert, AlertTitle, AlertDescription, Button, Image, Flex } from '@chakra-ui/react'
import errorImage from '@assets/images/error-message.png'
import colors from '@styles/variables/colors'

interface IErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface IErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Alert display='flex' alignItems='center' gap={10} justifyContent='center' minH='100vh' w='100%'>
            <Image src={errorImage} alt='Error' maxH='300px' maxW='300px' />
            <Flex flexDirection='column' gap={4}>
              <AlertTitle color={colors.brand.blackTextPrimary} fontSize='3xl'>
                Woops!
              </AlertTitle>
              <AlertTitle color={colors.brand.blackTextSecondary} fontSize='2xl'>
                Something went wrong :(
              </AlertTitle>
              <AlertDescription>{this.state.error?.message || 'An unexpected error occurred'}</AlertDescription>
              <Button onClick={this.handleReset} size='md'>
                Try Again
              </Button>
            </Flex>
          </Alert>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
