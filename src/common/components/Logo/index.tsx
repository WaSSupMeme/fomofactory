import { Link } from 'react-router-dom'

interface Props {
  to: string
}

const Logo = ({ to }: Props) => (
  <Link to={to}>
    <div className="flex flex-row gap-2">
      <img
        className="size-6 brightness-0 dark:brightness-100"
        alt="OffBlocks Logo"
        src="https://www.gitbook.com/cdn-cgi/image/width=36,dpr=2,height=36,fit=contain,format=auto/https%3A%2F%2F1545901005-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FTToCQFhAYRMgObGgbSjC%252Ficon%252FDh6pZgCGq3xDHGTJqj2U%252F64c27c23a9a29c8b75b80adc_63c2e59bdd3beb0dc856806a_Asset%25207%25404x-8.webp%3Falt%3Dmedia%26token%3D8d87ac54-9a87-4f45-adfa-4fff278e4144"
      />
      <span className="font-medium">OffBlocks</span>
    </div>
  </Link>
)

export default Logo
