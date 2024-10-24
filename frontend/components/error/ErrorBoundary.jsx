import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    
    // logErrorToMyService(error, info.componentStack);
    console.log('Log', error , info);
    
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // return this.props.fallback;
      return <h1>Somting wrong</h1>
    }

    return this.props.children;
  }
}

export default ErrorBoundary