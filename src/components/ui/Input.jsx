import React from 'react';
import clsx from 'clsx';

const Input = React.forwardRef(({ type = 'text', className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={clsx(
        'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
