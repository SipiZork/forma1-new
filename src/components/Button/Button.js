import React from 'react';

const Button = ({ onClick, children, style, ...props }) => {
  return (
    <button className={`btn${style ? ` ${style}` : ' btn-origin'}`} onClick={onClick} {...props}>{children}</button>
  )
}

export default Button;