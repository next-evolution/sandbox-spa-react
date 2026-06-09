const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
      region: (import.meta.env.VITE_COGNITO_REGION as string) || 'ap-northeast-1',
    },
  },
}

export default authConfig
