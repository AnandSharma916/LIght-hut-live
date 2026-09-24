import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-neutral-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-2xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-bold font-serif-luxury text-white">
              Something went wrong loading this section
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono bg-neutral-950 p-4 rounded-lg text-left overflow-x-auto border border-neutral-800">
              {this.state.error?.toString() || 'Unknown application error'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#DC2626] text-white text-xs uppercase tracking-wider font-bold shadow-lg hover:bg-red-700 transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
