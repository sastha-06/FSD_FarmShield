import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const styles = {
    info: {
      bg: 'bg-[#EEF5FD]',
      border: 'border-[#CCE0F8]',
      text: 'text-[#1B4D89]',
      icon: Info,
    },
    success: {
      bg: 'bg-[#EEF8F0]',
      border: 'border-[#CFE8D5]',
      text: 'text-[#246231]',
      icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-[#FCF7ED]',
      border: 'border-[#F7E2BF]',
      text: 'text-[#945C0B]',
      icon: AlertTriangle,
    },
    error: {
      bg: 'bg-[#FDF0EE]',
      border: 'border-[#F5C7C3]',
      text: 'text-error-red',
      icon: AlertCircle,
    },
  };

  const current = styles[type] || styles.info;
  const Icon = current.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${current.bg} ${current.border} ${current.text} ${className}`}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="leading-relaxed">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
