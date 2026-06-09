import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

type NavItem = { label: string; path: string }

const authMenus: { label: string; items: NavItem[] }[] = [
  { label: 'User', items: [{ label: 'Profile', path: '/user/profile' }] },
  { label: 'FX Trade', items: [{ label: 'Simulator', path: '/fx/trade/simulator' }] },
  {
    label: 'FX Indicator',
    items: [
      { label: 'ZigZag', path: '/fx/zigzag' },
      { label: 'EI Data', path: '/fx/economic-indicator-data' },
    ],
  },
  {
    label: 'FX barData',
    items: [
      { label: 'Trade', path: '/fx/bar-data/Trade/1H' },
      { label: 'Analyze', path: '/fx/bar-data/Analyze/1H' },
      { label: 'Import CSV', path: '/fx/bar-data/import-csv/Trade' },
    ],
  },
  {
    label: 'FX Master',
    items: [
      { label: 'Country', path: '/master/fx/country' },
      { label: 'Symbol', path: '/master/fx/symbol' },
      { label: 'Summer Time', path: '/master/fx/summertime' },
      { label: 'Eco. Indicator', path: '/master/fx/economic-indicator' },
    ],
  },
]

const adminMenus: { label: string; items: NavItem[] }[] = [
  {
    label: 'Admin',
    items: [
      { label: 'Users', path: '/admin/users' },
      { label: 'Master Refresh', path: '/admin/master-refresh' },
    ],
  },
]

const publicMenus: { label: string; items: NavItem[] }[] = [
  {
    label: 'Debug',
    items: [
      { label: 'Debug', path: '/debug' },
      { label: 'Color Sample', path: '/debug/color-sample' },
      { label: 'Lot Simulator', path: '/debug/lot-simulator' },
    ],
  },
]

const Navbar = () => {
  const { isAuthenticated, logout, user, sandboxUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpenMenu(null)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    if (!window.confirm('ログアウトしますか？')) return
    await logout()
    navigate('/')
  }

  const isMenuActive = (items: NavItem[]) => items.some((item) => location.pathname === item.path)

  return (
    <header className="navbar">
      <div className="navbar-inner" ref={navRef}>
        <NavLink to={isAuthenticated ? '/menu' : '/'} className="navbar-logo">
          <span className="logo-icon">✦</span>
          SANDBOX
        </NavLink>

        <nav className="navbar-links">
          {!isAuthenticated && (
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              HOME
            </NavLink>
          )}

          {isAuthenticated &&
            authMenus.map((menu) => (
              <div key={menu.label} className="nav-dropdown">
                <button
                  className={[
                    'nav-dropdown-trigger',
                    openMenu === menu.label ? 'open' : '',
                    isMenuActive(menu.items) ? 'active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setOpenMenu((prev) => (prev === menu.label ? null : menu.label))}
                >
                  {menu.label}
                  <span className="nav-dropdown-arrow">▾</span>
                </button>

                {openMenu === menu.label && (
                  <div className="nav-dropdown-menu">
                    {menu.items.length === 0 ? (
                      <span className="nav-dropdown-empty">準備中</span>
                    ) : (
                      menu.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`nav-dropdown-item${location.pathname === item.path ? ' active' : ''}`}
                          onClick={() => setOpenMenu(null)}
                        >
                          {item.label}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}

          {isAuthenticated &&
            sandboxUser?.admin &&
            adminMenus.map((menu) => (
              <div key={menu.label} className="nav-dropdown">
                <button
                  className={[
                    'nav-dropdown-trigger',
                    openMenu === menu.label ? 'open' : '',
                    isMenuActive(menu.items) ? 'active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setOpenMenu((prev) => (prev === menu.label ? null : menu.label))}
                >
                  {menu.label}
                  <span className="nav-dropdown-arrow">▾</span>
                </button>

                {openMenu === menu.label && (
                  <div className="nav-dropdown-menu">
                    {menu.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-dropdown-item${location.pathname === item.path ? ' active' : ''}`}
                        onClick={() => setOpenMenu(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

          {publicMenus.map((menu) => (
            <div key={menu.label} className="nav-dropdown">
              <button
                className={[
                  'nav-dropdown-trigger',
                  openMenu === menu.label ? 'open' : '',
                  isMenuActive(menu.items) ? 'active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setOpenMenu((prev) => (prev === menu.label ? null : menu.label))}
              >
                {menu.label}
                <span className="nav-dropdown-arrow">▾</span>
              </button>

              {openMenu === menu.label && (
                <div className="nav-dropdown-menu">
                  {menu.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-dropdown-item${location.pathname === item.path ? ' active' : ''}`}
                      onClick={() => setOpenMenu(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-area">
              <span className="user-name">{sandboxUser?.nickName ?? user?.username ?? 'User'}</span>
              <button
                className="btn-logout"
                onClick={() => {
                  void handleLogout()
                }}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn-login">
              ログイン
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
