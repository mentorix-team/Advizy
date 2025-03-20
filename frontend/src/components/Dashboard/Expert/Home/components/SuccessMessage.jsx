import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"

function SuccessMessage({
  message = "All actions completed successfully!",
  onDismiss,
  autoDismiss = false,
  dismissTimeout = 5000,
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoDismiss && visible) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onDismiss) onDismiss()
      }, dismissTimeout)

      return () => clearTimeout(timer)
    }
  }, [autoDismiss, dismissTimeout, onDismiss, visible])

  const handleDismiss = () => {
    setVisible(false)
    if (onDismiss) onDismiss()
  }

  if (!visible) return null

  return (
    <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-green-800">Success!</h3>
            <p className="text-green-700 mt-1">{message}</p>
          </div>
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-sm font-medium text-green-700 hover:text-green-800 bg-transparent hover:bg-green-100 rounded-md transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuccessMessage