import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error)
    return { hasError: true, message }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen bg-reading-bg flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <p className="text-destructive font-medium">Что-то пошло не так</p>
            <p className="text-sm text-muted-foreground font-mono">{this.state.message}</p>
            <Button onClick={() => window.location.reload()}>Перезагрузить</Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
