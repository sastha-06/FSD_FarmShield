import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variants = {
    default: 'bg-light-sage/60 text-forest-green border-light-sage',
    success: 'bg-[#EBF7EE] text-[#2C6B37] border-[#CFE8D5]',
    warning: 'bg-[#FDF4E5] text-[#9E6510] border-[#F7E2BF]',
    danger: 'bg-[#FCEAE8] text-error-red border-[#F5C7C3]',
    info: 'bg-[#E8F1FC] text-[#205799] border-[#CCE0F8]',
    neutral: 'bg-soft-cream text-muted-green border-border-green',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-fresh-green'
              : variant === 'warning'
              ? 'bg-warning-amber'
              : variant === 'danger'
              ? 'bg-error-red'
              : 'bg-forest-green'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
