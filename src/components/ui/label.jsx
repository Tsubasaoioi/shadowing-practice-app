import React from 'react'

export function Label({ children, ...props }) {
  return <label {...props} className="block text-sm font-medium text-gray-700">{children}</label>
}