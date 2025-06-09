import React from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

// Main Select wrapper
export const Select = ({ value, onChange, children }) => (
  <Listbox value={value} onChange={onChange}>
    <div className="relative w-full">{children}</div>
  </Listbox>
);


// Trigger component
export const SelectTrigger = ({ children }) => (
  <Listbox.Button className="flex justify-between items-center w-full px-4 py-2 border rounded bg-white shadow-sm text-left">
    {children}
    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
  </Listbox.Button>
);

// Value display
export const SelectValue = ({ placeholder, value }) => (
  <span className="truncate text-gray-700">
    {value || <span className="text-gray-400">{placeholder}</span>}
  </span>
);

// Content (dropdown list)
export const SelectContent = ({ children }) => (
  <Listbox.Options className="absolute mt-1 w-full max-w-full z-10 overflow-auto rounded-md border bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
    {children}
  </Listbox.Options>
);


// Each dropdown item
export const SelectItem = ({ value, children }) => (
  <Listbox.Option
    value={value}
    className={({ active, selected }) =>
      `w-full cursor-pointer select-none px-4 py-2 ${
        active ? 'bg-blue-100' : ''
      } ${selected ? 'font-medium text-blue-600' : 'text-gray-900'}`
    }
  >
    {({ selected }) => (
      <div className="flex justify-between items-center w-full">
        {children}
        {selected && <Check className="h-4 w-4 text-blue-600" />}
      </div>
    )}
  </Listbox.Option>
);

