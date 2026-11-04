import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-card border border-border-green shadow-card ${
        hover ? 'transition-all duration-300 hover:shadow-card-hover hover:border-fresh-green/40' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
