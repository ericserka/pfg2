import { toggleToast } from '../toasts/toggleToast'

export const handleSocketResponse = (
  { success, message },
  toast,
  actions = () => {}
) => {
  success && actions()
  toggleToast(toast, message, success ? 'success' : 'error')
}
