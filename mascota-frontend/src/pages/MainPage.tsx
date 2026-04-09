import { useState } from 'react'
import { PawPrint, LogOut, LayoutDashboard, Cat, ClipboardList, Users, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Mascota } from '@/types'
import DashboardTab from '@/components/dashboard/DashboardTab'
import MascotasTab from '@/components/mascotas/MascotasTab'
import MascotaDetailPage from '@/components/mascotas/MascotaDetailPage'
import VisitasTab from '@/components/visitas/VisitasTab'
import PropietariosTab from '@/components/propietarios/PropietariosTab'
import ConfiguracionTab from '@/components/configuracion/ConfiguracionTab'

type TabValue = 'dashboard' | 'mascotas' | 'visitas' | 'propietarios' | 'configuracion'

export default function MainPage() {
  const { username, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<TabValue>('dashboard')
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null)

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'mascotas', label: 'Mascotas', icon: Cat },
    { value: 'visitas', label: 'Visitas', icon: ClipboardList },
    { value: 'propietarios', label: 'Propietarios', icon: Users },
    { value: 'configuracion', label: 'Configuración', icon: Settings },
  ] as const

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block">VetManager</span>
          </div>

          {/* Tabs — desktop inline */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabValue)}
            className="flex-1"
          >
            <TabsList className="hidden md:flex h-9 bg-transparent gap-1 p-0">
              {tabs.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-1.5 px-3 h-9 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* User + logout */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">{username}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden border-t overflow-x-auto">
          <div className="flex px-2 py-1 gap-1 min-w-max">
            {tabs.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value as TabValue)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors
                  ${activeTab === value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Mascota detail — full page view */}
        {selectedMascota ? (
          <MascotaDetailPage
            mascota={selectedMascota}
            onBack={() => setSelectedMascota(null)}
            onDeleted={() => setSelectedMascota(null)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'mascotas' && (
              <MascotasTab onSelectMascota={(m) => { setSelectedMascota(m); setActiveTab('mascotas') }} />
            )}
            {activeTab === 'visitas' && <VisitasTab />}
            {activeTab === 'propietarios' && <PropietariosTab />}
            {activeTab === 'configuracion' && <ConfiguracionTab />}
          </>
        )}
      </main>
    </div>
  )
}
