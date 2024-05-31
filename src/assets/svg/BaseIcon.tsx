import React from 'react'

export const BaseIcon = React.forwardRef<SVGElement, React.HTMLAttributes<SVGElement>>(
  ({ className, title }) => {
    return (
      <svg
        className={className}
        width="100%"
        height="100%"
        viewBox="0 0 111 111"
        preserveAspectRatio="xMinYMin slice"
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <path
          d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z"
          fill="#0052FF"
        />
      </svg>
    )
  },
)
