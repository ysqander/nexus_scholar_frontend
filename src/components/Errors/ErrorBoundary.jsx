import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const errorLog = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    }

    // Use an environment variable to control logging behavior
    const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'error'

    if (LOG_LEVEL === 'debug') {
      // In debug mode, log everything
      console.error('Debug Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Full Error Log:', JSON.stringify(errorLog, null, 2))
    } else if (LOG_LEVEL === 'error') {
      // In production or error mode, log to Railway
      console.error('RAILWAY_ERROR:', JSON.stringify(errorLog))
      console.error(
        'RAILWAY_ERROR_CONTEXT:',
        JSON.stringify({
          url: window.location.href,
          userAgent: navigator.userAgent,
        })
      )
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>
            We're sorry for the inconvenience. Please try refreshing the page or
            contact us if the problem persists.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
