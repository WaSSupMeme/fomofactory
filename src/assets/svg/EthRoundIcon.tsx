import React from 'react'

export const EthRoundIcon = React.forwardRef<SVGElement, React.HTMLAttributes<SVGElement>>(
  ({ className }) => {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z"
          fill="white"
        />
        <path
          d="M24.0376 9.59998L23.8446 10.2561V29.295L24.0376 29.4877L32.8753 24.2638L24.0376 9.59998Z"
          fill="#343434"
        />
        <path d="M24.0377 9.59998L15.2 24.2638L24.0377 29.4878V20.2469V9.59998Z" fill="#8C8C8C" />
        <path
          d="M24.0376 31.1611L23.9288 31.2937V38.0758L24.0376 38.3936L32.8805 25.9398L24.0376 31.1611Z"
          fill="#3C3C3B"
        />
        <path d="M24.0377 38.3935V31.161L15.2 25.9397L24.0377 38.3935Z" fill="#8C8C8C" />
        <path d="M24.0376 29.4877L32.8751 24.2639L24.0376 20.2469V29.4877Z" fill="#141414" />
        <path d="M15.2001 24.2639L24.0376 29.4877V20.2469L15.2001 24.2639Z" fill="#393939" />
      </svg>
    )
  },
)
