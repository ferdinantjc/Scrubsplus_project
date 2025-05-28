import React from 'react'

const Button = ({ children, onClick, type = 'button', className = '', ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
