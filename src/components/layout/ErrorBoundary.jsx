import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error in app tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
          <p className="font-display text-2xl text-ink">Something went wrong.</p>
          <p className="text-[15px] text-ink-muted">Try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
