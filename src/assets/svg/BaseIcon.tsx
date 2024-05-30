import React from 'react'

export const BaseIcon = React.forwardRef<SVGElement, React.HTMLAttributes<SVGElement>>(
  ({ className, title }) => {
    return (
      <svg
        className={className}
        viewBox="0 0 146 146"
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <circle cx="73" cy="73" r="73" fill="#0052FF" />
        <path
          d="M73.323 123.729C101.617 123.729 124.553 100.832 124.553 72.5875C124.553 44.343 101.617 21.4463 73.323 21.4463C46.4795 21.4463 24.4581 42.0558 22.271 68.2887H89.9859V76.8864H22.271C24.4581 103.119 46.4795 123.729 73.323 123.729Z"
          fill="white"
        />
      </svg>
    )
  },
)
