import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

type NavItem = { label: string; path: string }
type Category = { id: string; icon: string; title: string; accent: string; items: NavItem[] }

const categories: Category[] = [
    {
      id: 'user',
      icon: '👤',
      title: 'User',
      accent: 'purple',
      items: [{ label: 'Profile', path: '/user/profile' }],
    },
    {
      id: 'fx-trade',
      icon: '💹',
      title: 'FX Trade',
      accent: 'cyan',
      items: [{ label: 'Simulator', path: '/fx/trade/simulator' }],
    },
    {
      id: 'fx-indicator',
      icon: '📉',
      title: 'FX Indicator',
      accent: 'purple',
      items: [
        { label: 'ZigZag', path: '/fx/zigzag' },
        { label: 'EI Data', path: '/fx/economic-indicator-data' },
      ],
    },
    {
      id: 'fx-bardata',
      icon: '📊',
      title: 'FX barData',
      accent: 'blue',
      items: [
        { label: 'Trade', path: '/fx/bar-data/Trade/1H' },
        { label: 'Analyze', path: '/fx/bar-data/Analyze/1H' },
        { label: 'Import CSV', path: '/fx/bar-data/import-csv/Trade' },
      ],
    },
    {
      id: 'fx-master',
      icon: '🗂️',
      title: 'FX Master',
      accent: 'pink',
      items: [
        { label: 'Country', path: '/master/fx/country' },
        { label: 'Symbol', path: '/master/fx/symbol' },
        { label: 'Summer Time', path: '/master/fx/summertime' },
        { label: 'Eco. Indicator', path: '/master/fx/economic-indicator' },
      ],
    },
    {
      id: 'debug',
      icon: '🔧',
      title: 'Debug',
      accent: 'amber',
      items: [
        { label: 'Debug', path: '/debug' },
        { label: 'Color Sample', path: '/debug/color-sample' },
        { label: 'Lot Simulator', path: '/debug/lot-simulator' },
      ],
    },
  ]

const adminCategories: Category[] = [
  {
    id: 'admin',
    icon: '⚙️',
    title: 'Admin',
    accent: 'pink',
    items: [
      { label: 'Users', path: '/admin/users' },
      { label: 'Master Refresh', path: '/admin/master-refresh' },
    ],
  },
]

const MenuPage = () => {
  const { user, sandboxUser } = useAuth()

  const visibleCategories = sandboxUser?.admin
    ? [...categories, ...adminCategories]
    : categories

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">
            ようこそ, {sandboxUser?.nickName ?? user?.username ?? 'User'}
          </p>
          <h1 className="page-title">メインメニュー</h1>
          <p className="page-subtitle">全機能へのアクセスポイント</p>
        </div>
        <div className="header-badge">
          <span className="status-dot" />
          システム正常稼働中
        </div>
      </div>

      <div className="menu-categories">
        {visibleCategories.map((cat) => (
          <div key={cat.id} className={`menu-cat-card accent-${cat.accent}`}>
            <div className="menu-cat-header">
              <span className="menu-cat-icon">{cat.icon}</span>
              <h3 className="menu-cat-title">{cat.title}</h3>
            </div>
            <div className="menu-cat-links">
              {cat.items.length === 0 ? (
                <span className="menu-cat-empty">準備中</span>
              ) : (
                cat.items.map((item) => (
                  <Link key={item.path} to={item.path} className="menu-cat-link">
                    <span>{item.label}</span>
                    <span className="menu-cat-arrow">→</span>
                  </Link>
                ))
              )}
            </div>
            <div className="bento-glow" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MenuPage
