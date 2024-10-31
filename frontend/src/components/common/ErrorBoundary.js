import React from 'react';
import { Alert, Button, Card, Typography } from 'antd';

const { Text } = Typography;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <Alert
            message="Something went wrong"
            description={
              <div>
                <Text type="secondary">
                  {this.state.error && this.state.error.toString()}
                </Text>
                <br />
                <Button 
                  type="primary" 
                  onClick={() => window.location.reload()}
                  style={{ marginTop: 16 }}
                >
                  Reload Page
                </Button>
              </div>
            }
            type="error"
            showIcon
          />
        </Card>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary }; 