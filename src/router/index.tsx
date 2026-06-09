import { Routes, Route } from 'react-router-dom'
import GuardMember from './GuardMember'
import GuardAdmin from './GuardAdmin'
import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import MenuPage from '@/pages/menu'
import Menu2Page from '@/pages/menu2'
import CountryPage from '@/pages/master/fx/country'
import SymbolPage from '@/pages/master/fx/symbol'
import SummerTimePage from '@/pages/master/fx/summertime'
import EconomicIndicatorPage from '@/pages/master/fx/economic-indicator'
import SimulatorPage from '@/pages/fx/trade/simulator'
import ZigZagPage from '@/pages/fx/zigzag'
import ZigZagGeneratePage from '@/pages/fx/zigzag/generate'
import BarDataPage from '@/pages/fx/bar-data'
import BarDataImportPage from '@/pages/fx/bar-data/import-csv'
import EconomicIndicatorDataPage from '@/pages/fx/economic-indicator-data'
import EconomicIndicatorDataImportPage from '@/pages/fx/economic-indicator-data/import-text'
import MasterRefreshPage from '@/pages/admin/master-refresh'
import AdminUsersPage from '@/pages/admin/users'
import ProfilePage from '@/pages/user/profile'
import RegistrationPage from '@/pages/user/registration'
import PendingApprovalPage from '@/pages/user/pending-approval'
import BlockedPage from '@/pages/error/blocked'
import GuardRegistration from './GuardRegistration'
import DebugPage from '@/pages/debug'
import ColorSamplePage from '@/pages/debug/ColorSample'
import LotSimilatorPage from '@/pages/debug/LotSimilator'

const RouterConfig = () => (
  <Routes>
    {/* public */}
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/user/registration"
      element={
        <GuardRegistration>
          <RegistrationPage />
        </GuardRegistration>
      }
    />
    <Route path="/pending-approval" element={<PendingApprovalPage />} />
    <Route path="/error/blocked" element={<BlockedPage />} />
    <Route path="/debug" element={<DebugPage />} />
    <Route path="/debug/color-sample" element={<ColorSamplePage />} />
    <Route path="/debug/lot-simulator" element={<LotSimilatorPage />} />

    {/* member */}
    <Route
      path="/user/profile"
      element={
        <GuardMember>
          <ProfilePage />
        </GuardMember>
      }
    />
    <Route
      path="/menu"
      element={
        <GuardMember>
          <MenuPage />
        </GuardMember>
      }
    />
    <Route
      path="/master/fx/country"
      element={
        <GuardMember>
          <CountryPage />
        </GuardMember>
      }
    />
    <Route
      path="/master/fx/symbol"
      element={
        <GuardMember>
          <SymbolPage />
        </GuardMember>
      }
    />
    <Route
      path="/master/fx/summertime"
      element={
        <GuardMember>
          <SummerTimePage />
        </GuardMember>
      }
    />
    <Route
      path="/master/fx/economic-indicator"
      element={
        <GuardMember>
          <EconomicIndicatorPage />
        </GuardMember>
      }
    />
    <Route
      path="/fx/bar-data/import-csv/:symbolType"
      element={
        <GuardMember>
          <BarDataImportPage />
        </GuardMember>
      }
    />
    <Route
      path="/fx/bar-data/:symbolType/:barType"
      element={
        <GuardMember>
          <BarDataPage />
        </GuardMember>
      }
    />
    <Route
      path="/fx/economic-indicator-data/import-text"
      element={
        <GuardMember>
          <EconomicIndicatorDataImportPage />
        </GuardMember>
      }
    />
    <Route
      path="/fx/economic-indicator-data"
      element={
        <GuardMember>
          <EconomicIndicatorDataPage />
        </GuardMember>
      }
    />

    {/* member - trade */}
    <Route
      path="/fx/trade/simulator"
      element={
        <GuardMember>
          <SimulatorPage />
        </GuardMember>
      }
    />

    {/* admin */}
    <Route
      path="/fx/zigzag"
      element={
        <GuardAdmin>
          <ZigZagPage />
        </GuardAdmin>
      }
    />
    <Route
      path="/fx/zigzag/generate"
      element={
        <GuardAdmin>
          <ZigZagGeneratePage />
        </GuardAdmin>
      }
    />
    <Route
      path="/menu2"
      element={
        <GuardAdmin>
          <Menu2Page />
        </GuardAdmin>
      }
    />
    <Route
      path="/admin/users"
      element={
        <GuardAdmin>
          <AdminUsersPage />
        </GuardAdmin>
      }
    />
    <Route
      path="/admin/master-refresh"
      element={
        <GuardAdmin>
          <MasterRefreshPage />
        </GuardAdmin>
      }
    />
  </Routes>
)

export default RouterConfig
