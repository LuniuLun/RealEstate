const globalStyles = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false
  },
  fonts: {
    heading: 'Open Sans, sans-serif',
    body: 'Open Sans, sans-serif'
  },
  styles: {
    global: () => ({
      body: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'brand.blackTextPrimary',
        bg: 'brand.white'
      },

      '#root': {
        width: '100%',
        maxWidth: '1800px',
        backgroundColor: 'brand.grey',
        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)'
      },

      '::-webkit-scrollbar': {
        width: '8px',
        height: '10px',
        backgroundColor: 'brand.secondary'
      },

      '::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        backgroundColor: 'brand.secondary'
      },

      '::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'brand.blackTextSecondary'
      },

      '::-webkit-scrollbar-track': {
        backgroundColor: 'brand.white',
        borderRadius: '10px'
      }
    })
  }
}

export default globalStyles
