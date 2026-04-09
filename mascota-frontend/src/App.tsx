import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import LoginPage from '@/pages/LoginPage'
import MainPage from '@/pages/MainPage'

function AppRouter() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <MainPage /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  )
}
