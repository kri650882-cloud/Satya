import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, MessageCircle, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Satya Yadav Property Portal UI caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 bg-stone-50">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              {this.props.fallbackTitle || "Something went wrong"}
            </h2>
            
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              {this.props.fallbackMessage || "An unexpected issue occurred. Please try again or contact us directly on WhatsApp for immediate plot information."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry / पुनः प्रयास करें</span>
              </button>

              <a
                href="https://wa.me/919718526796?text=Hello%20Satya%20Yadav,%20I%20am%20facing%20an%20issue%20on%20satyayadav.in%20website.%20Please%20assist%20me."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Help</span>
              </a>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100">
              <button
                onClick={this.handleReset}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 mx-auto"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Homepage (होमपेज पर जाएँ)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
