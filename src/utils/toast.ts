import { toast, type ToastOptions } from 'vue3-toastify'

const DEFAULT: ToastOptions = {
  position: 'bottom-center',
  autoClose: 1500,
  hideProgressBar: true,
  closeButton: false,
}

export function showSuccessToast(message: string, opts?: ToastOptions) {
  toast.success(message, { ...DEFAULT, ...opts })
}
export function showErrorToast(message: string, opts?: ToastOptions) {
  toast.error(message, { ...DEFAULT, ...opts })
}
export function showInfoToast(message: string, opts?: ToastOptions) {
  toast.info(message, { ...DEFAULT, ...opts })
}
export function showWarningToast(message: string, opts?: ToastOptions) {
  toast.warning(message, { ...DEFAULT, ...opts })
}
