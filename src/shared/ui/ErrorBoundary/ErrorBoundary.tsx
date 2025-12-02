import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { ErrorState } from '@shared/ui/Loading/ErrorState';
import { devLog } from '@shared/utils/errorHandler';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    devLog.error('Error capturado por ErrorBoundary:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }
      return <ErrorState error={this.state.error} onRetry={this.resetError} />;
    }

    return this.props.children;
  }
}
