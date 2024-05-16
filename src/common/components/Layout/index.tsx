import { type ReactNode } from 'react'

import Header, { type HeaderProps } from '@/common/components/Header'

interface Props {
  children: ReactNode
  headerProps: HeaderProps
}

const Layout = ({ children, headerProps }: Props) => (
  <>
    <div className="flex h-full w-full flex-col">
      <Header
        baseUrl={headerProps.baseUrl}
        links={headerProps.links}
        endSlot={headerProps.endSlot}
      />
      <main className="flex-1py-4 container relative h-full sm:py-8">{children}</main>
    </div>
  </>
)

export default Layout
