import { Component, type ErrorInfo, type ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode; title?: string },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    const message = String(this.state.error.message || 'The last action crashed this screen.')
    const storeMissing = /store missing/i.test(message)
    return (
      <div className="crash-card">
        <p className="kicker">Something broke</p>
        <h1>{this.props.title || 'The Pad hit a sour note'}</h1>
        <p className="lede">{message}</p>
        <button
          type="button"
          onClick={() => {
            if (storeMissing) {
              window.location.reload()
              return
            }
            this.setState({ error: null })
          }}
        >
          {storeMissing ? 'Reload the Pad' : 'Try again'}
        </button>
      </div>
    )
  }
}
