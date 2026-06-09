import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/components/Layout'
import RouterConfig from '@/router'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Layout>
        <RouterConfig />
      </Layout>
    </AuthProvider>
  </BrowserRouter>
)

export default App
