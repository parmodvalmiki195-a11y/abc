import { Link } from 'react-router-dom'

const modes = [
  { label: 'user', path: '/' },
  { label: 'admin', path: '/admin' },
]

function ModeSwitch({ canUseAdmin, mode }) {
  return (
    <div className="grid grid-cols-2 rounded bg-[#001f70] p-1 shadow-sm">
      {modes.map((item) => {
        const path = item.label === 'admin' && !canUseAdmin ? '/admin-login' : item.path
        const active = mode === item.label
        const className = `flex h-7 items-center justify-center rounded px-4 text-xs font-bold capitalize transition ${
          active
            ? 'bg-[#fff1b8] text-slate-950'
            : 'text-white hover:text-[#fff1b8]'
        }`

        return (
          <Link key={item.label} to={path} className={className}>
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}

export default ModeSwitch
