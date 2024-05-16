import { useTheme } from '@/app/providers/Theme'
import { Link } from 'react-router-dom'

import lightLogo from '@/assets/png/logo-light.png'
import darkLogo from '@/assets/png/logo-dark.png'

interface Props {
  to: string
}

const Logo = ({ to }: Props) => {
  const { theme } = useTheme()

  return (
    <Link to={to}>
      <div className="flex flex-row gap-2">
        <img className="h-12" alt="Logo" src={theme === 'dark' ? darkLogo : lightLogo} />
      </div>
    </Link>
  )
}

export default Logo
