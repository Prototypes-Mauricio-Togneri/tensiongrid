/**
 * Displays JavaScript errors via alert() for immediate developer visibility.
 */
class ErrorNotifier {
    /**
     * Initialize global error handlers.
     */
    init() {
        window.onerror = (message, source, line, col, error) => {
            const fileName = source?.split('/').pop() || 'unknown'
            const stack = error?.stack || ''
            alert(`Error: ${message}\n\nSource: ${fileName}:${line}:${col}\n\n${stack}`)
            return false // Still log to console
        }

        window.addEventListener('unhandledrejection', (event) => {
            const message = event.reason?.message || event.reason || 'Unhandled Promise rejection'
            const stack = event.reason?.stack || ''
            alert(`Unhandled Promise Rejection:\n\n${message}\n\n${stack}`)
        })
    }
}
