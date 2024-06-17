import { cn } from '@/common/styleUtils'
import React from 'react'

export const Logo = React.forwardRef<SVGElement, React.HTMLAttributes<SVGElement>>(
  ({ className }) => {
    return (
      <svg
        className={cn(className, 'fill-primary')}
        viewBox="39.396 27.831 290.222 42.427"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 48.14 38.67 L 73.22 38.67 L 73.22 45.45 L 59.18 45.45 L 59.18 47.52 L 69.44 47.52 L 69.44 53.61 L 59.18 53.61 L 59.18 59.67 L 48.14 59.67 Z M 83.72 60.18 Q 77.51 60.18 74.15 58.05 Q 70.79 55.92 70.79 51.99 Q 70.79 48.09 74.15 45.99 Q 77.51 43.89 83.72 43.89 Q 89.9 43.89 93.24 46.02 Q 96.59 48.15 96.59 52.05 Q 96.59 55.95 93.23 58.06 Q 89.87 60.18 83.72 60.18 Z M 80.9 52.02 Q 80.9 53.04 81.62 53.58 Q 82.34 54.12 83.72 54.12 Q 85.04 54.12 85.76 53.58 Q 86.48 53.04 86.48 52.02 Q 86.48 51 85.76 50.44 Q 85.04 49.89 83.72 49.89 Q 82.37 49.89 81.63 50.44 Q 80.9 51 80.9 52.02 Z M 125 52.05 Q 125 49.95 123.35 49.95 Q 122.42 49.95 121.83 50.7 Q 121.25 51.45 121.25 52.8 L 121.25 59.67 L 111.26 59.67 L 111.26 52.05 Q 111.26 49.95 109.58 49.95 Q 108.65 49.95 108.06 50.7 Q 107.48 51.45 107.48 52.8 L 107.48 59.67 L 97.49 59.67 L 97.49 44.43 L 104.75 44.43 L 107.39 50.64 L 107.54 50.64 Q 107.36 47.43 109.11 45.66 Q 110.87 43.89 114.11 43.89 Q 117.14 43.89 118.94 45.64 Q 120.74 47.4 121.01 50.64 L 121.25 50.64 Q 121.1 47.4 122.78 45.64 Q 124.46 43.89 127.7 43.89 Q 131.27 43.89 133.13 45.61 Q 134.99 47.34 134.99 50.58 L 134.99 59.67 L 125 59.67 L 125 52.05 Z M 148.9 60.18 Q 142.69 60.18 139.33 58.05 Q 135.97 55.92 135.97 51.99 Q 135.97 48.09 139.33 45.99 Q 142.69 43.89 148.9 43.89 Q 155.08 43.89 158.43 46.02 Q 161.77 48.15 161.77 52.05 Q 161.77 55.95 158.41 58.06 Q 155.05 60.18 148.9 60.18 Z M 146.08 52.02 Q 146.08 53.04 146.8 53.58 Q 147.52 54.12 148.9 54.12 Q 150.22 54.12 150.94 53.58 Q 151.66 53.04 151.66 52.02 Q 151.66 51 150.94 50.44 Q 150.22 49.89 148.9 49.89 Q 147.55 49.89 146.82 50.44 Q 146.08 51 146.08 52.02 Z M 162.46 38.67 L 187.54 38.67 L 187.54 45.45 L 173.5 45.45 L 173.5 47.52 L 183.76 47.52 L 183.76 53.61 L 173.5 53.61 L 173.5 59.67 L 162.46 59.67 Z M 199.03 54.63 L 198.82 54.63 Q 198.82 55.77 198.19 57.06 Q 197.56 58.35 196.06 59.28 Q 194.56 60.21 192.1 60.21 Q 188.8 60.21 187.27 59.02 Q 185.74 57.84 185.74 55.83 Q 185.74 53.28 187.69 52.2 Q 189.64 51.12 192.88 51.12 Q 196.18 51.12 198.46 51.42 Q 198.31 50.7 197.82 50.38 Q 197.32 50.07 196.06 50.07 Q 192.82 50.07 188.8 50.67 L 188.02 44.61 Q 192.28 43.89 196.84 43.89 Q 202.81 43.89 205.65 45.85 Q 208.48 47.82 208.48 51.27 L 208.48 59.67 L 201.22 59.67 Z M 195.79 54.06 Q 195.79 54.57 196.14 54.87 Q 196.48 55.17 197.08 55.17 Q 197.83 55.17 198.31 54.66 Q 198.79 54.15 198.73 53.37 L 198.64 52.8 Q 198.34 52.77 197.65 52.77 Q 196.63 52.77 196.21 53.1 Q 195.79 53.43 195.79 54.06 Z M 229.07 50.82 Q 225.92 49.89 223.22 49.89 Q 221.57 49.89 220.61 50.28 Q 219.65 50.67 219.65 52.02 Q 219.65 53.37 220.61 53.77 Q 221.57 54.18 223.22 54.18 Q 225.89 54.18 229.07 53.22 L 229.4 59.31 Q 228.08 59.73 226.35 59.97 Q 224.63 60.21 222.77 60.21 Q 219.56 60.21 216.56 59.47 Q 213.56 58.74 211.52 56.91 Q 209.48 55.08 209.48 52.02 Q 209.48 48.96 211.52 47.14 Q 213.56 45.33 216.56 44.61 Q 219.56 43.89 222.77 43.89 Q 224.75 43.89 226.49 44.11 Q 228.23 44.34 229.4 44.73 L 229.07 50.82 Z M 249.73 59.85 Q 249.16 59.97 247.44 60.09 Q 245.71 60.21 243.28 60.21 Q 240.28 60.21 238.09 59.62 Q 235.9 59.04 234.55 57.37 Q 233.2 55.71 233.2 52.65 L 233.2 50.82 L 230.2 50.82 L 230.2 44.43 L 234.19 44.43 L 233.08 39.9 L 244.48 39.9 L 241.15 44.43 L 249.52 44.43 L 249.52 50.82 L 243.16 50.82 L 243.16 52.05 Q 243.16 52.89 244.02 53.25 Q 244.87 53.61 246.43 53.61 Q 248.41 53.61 249.34 53.4 L 249.73 59.85 Z M 263.23 60.18 Q 257.02 60.18 253.66 58.05 Q 250.3 55.92 250.3 51.99 Q 250.3 48.09 253.66 45.99 Q 257.02 43.89 263.23 43.89 Q 269.41 43.89 272.76 46.02 Q 276.1 48.15 276.1 52.05 Q 276.1 55.95 272.74 58.06 Q 269.38 60.18 263.23 60.18 Z M 260.41 52.02 Q 260.41 53.04 261.13 53.58 Q 261.85 54.12 263.23 54.12 Q 264.55 54.12 265.27 53.58 Q 265.99 53.04 265.99 52.02 Q 265.99 51 265.27 50.44 Q 264.55 49.89 263.23 49.89 Q 261.88 49.89 261.15 50.44 Q 260.41 51 260.41 52.02 Z M 284.26 44.43 L 286.93 51.24 L 287.05 51.24 Q 286.99 50.34 286.99 49.95 Q 286.99 43.89 291.91 43.89 Q 293.35 43.89 295.24 44.46 L 294.76 51.81 Q 291.79 50.7 289.9 50.7 Q 288.46 50.7 287.72 51.36 Q 286.99 52.02 286.99 53.31 L 286.99 59.67 L 277 59.67 L 277 44.43 Z M 308.56 64.59 Q 303.61 64.59 301.18 64.2 L 301.45 60.06 L 307.6 60.06 Q 308.59 60.06 309.04 59.89 Q 309.49 59.73 309.61 59.31 L 309.67 59.1 L 299.83 59.1 L 295.9 44.43 L 306.19 44.43 L 309.52 58.71 L 309.73 58.71 L 312.94 44.43 L 323.23 44.43 L 319.36 59.1 L 319.18 59.73 Q 318.43 62.4 315.7 63.49 Q 312.97 64.59 308.56 64.59 Z" />
      </svg>
    )
  },
)