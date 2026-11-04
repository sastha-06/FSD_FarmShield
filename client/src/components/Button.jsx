import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-forest-green hover:bg-[#123d2a] text-white shadow-sm focus:ring-forest-green',
    secondary: 'bg-fresh-green hover:bg-[#528d58] text-white shadow-sm focus:ring-fresh-green',
    outline: 'border border-border-green bg-white hover:bg-soft-cream text-deep-charcoal focus:ring-forest-green',
    sage: 'bg-light-sage text-forest-green hover:bg-[#cde2cf] focus:ring-fresh-green',
    danger: 'bg-error-red hover:bg-[#ad4e44] text-white focus:ring-error-red',
    ghost: 'text-deep-charcoal hover:bg-light-sage/40 focus:ring-forest-green',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
