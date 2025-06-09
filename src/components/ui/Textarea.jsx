import React from 'react';
import clsx from 'clsx';

export const Textarea = React.forwardRef(({ className = '', rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={clsx(
        'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;