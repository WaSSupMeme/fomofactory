import { Link } from 'react-router-dom'

import logo from '@/assets/png/logo-light.png'

interface Props {
  to: string
}

const Logo = ({ to }: Props) => {
  return (
    <Link to={to}>
      <div className="flex flex-row gap-2">
        <img className="h-12" alt="Logo" src={logo} />
      </div>
    </Link>
  )
}

export default Logo
