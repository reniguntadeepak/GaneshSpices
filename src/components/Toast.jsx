import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';

export default function Toast() {
  const { toast, hideToast } = useToast();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(hideToast, 3500);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div
      className={`toast toast--${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <span className="toast__icon" aria-hidden="true">
        {toast.type === 'success' ? '✓' : '!'}
      </span>
      <p className="toast__message">{toast.message}</p>
      <button
        type="button"
        className="toast__close"
        onClick={hideToast}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
