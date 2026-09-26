import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import authConfig from './config/authConfig'
import { inMemoryStorage } from './config/inMemoryStorage'
import App from './App'
import './index.css'

Amplify.configure(authConfig)
// CognitoトークンをlocalStorageではなくメモリ上にのみ保持する（XSS時の永続的窃取を防ぐ）。
// 詳細・トレードオフは CLAUDE.md「認証」節を参照。
cognitoUserPoolsTokenProvider.setKeyValueStorage(inMemoryStorage)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
