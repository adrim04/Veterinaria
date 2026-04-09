import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Search, Plus, PawPrint, RefreshCw } from 'lucide-react'
import { getMascotas, searchMascotas } from '@/api/mascotas'
import type { Mascota } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import NuevaMascotaWizard from './NuevaMascotaWizard'

const ESPECIE_COLORS: Record<string, string> = {
  Canino: 'bg-blue-100 text-blue-700 border-blue-200',
  Felino: 'bg-orange-100 text-orange-700 border-orange-200',
  Ave: 'bg-green-100 text-green-700 border-green-200',
  Roedor: 'bg-purple-100 text-purple-700 border-purple-200',
}

function calcularEdad(fechaNacimiento: string): string {
  if (!fechaNacimiento) return '—'
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  const meses =
    (hoy.getFullYear() - nac.getFullYear()) * 12 +
    (hoy.getMonth() - nac.getMonth())
  if (meses < 1) return 'Recién nacido'
  if (meses < 12) return `${meses} mes${meses > 1 ? 'es' : ''}`
  const años = Math.floor(meses / 12)
  const mesesR = meses % 12
  return mesesR > 0 ? `${años}a ${mesesR}m` : `${años} año${años > 1 ? 's' : ''}`
}

interface Props {
  onSelectMascota: (mascota: Mascota) => void
}

export default function MascotasTab({ onSelectMascota }: Props) {
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [showWizard, setShowWizard] = useState(false)

  const fetchMascotas = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMascotas()
      if (res.success) setMascotas(res.data)
      else toast.error(res.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cargar mascotas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMascotas() }, [fetchMascotas])

  const handleSearch = async () => {
    if (!search.trim()) { fetchMascotas(); return }
    setSearching(true)
    try {
      const res = await searchMascotas({ nombre: search })
      if (res.success) setMascotas(res.data)
      else toast.error(res.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error en búsqueda')
    } finally {
      setSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') { setSearch(''); fetchMascotas() }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Mascotas</h2>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Cargando...' : `${mascotas.length} mascota${mascotas.length !== 1 ? 's' : ''} registrada${mascotas.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mascota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => { setSearch(''); fetchMascotas() }} title="Refrescar">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Nueva mascota
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Registro de mascotas</CardTitle>
          <CardDescription>Haz clic en una mascota para ver su historial completo</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading || searching ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          ) : mascotas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PawPrint className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="font-medium text-muted-foreground">No hay mascotas registradas</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                {search ? 'Intenta con otro término de búsqueda' : 'Crea la primera mascota con el botón "Nueva mascota"'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Especie</TableHead>
                    <TableHead>Raza</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Peso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mascotas.map((m) => (
                    <TableRow
                      key={m.id}
                      className="cursor-pointer hover:bg-muted/60 transition-colors"
                      onClick={() => onSelectMascota(m)}
                    >
                      <TableCell className="font-semibold">{m.nombre}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={ESPECIE_COLORS[m.especie?.nombre] ?? 'bg-muted'}
                        >
                          {m.especie?.nombre ?? '—'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {m.raza?.nombre ?? '—'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {m.propietario
                          ? `${m.propietario.nombre} ${m.propietario.apellido}`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        {m.sexo === 'M' ? (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-medium">♂ Macho</Badge>
                        ) : m.sexo === 'H' ? (
                          <Badge className="bg-pink-100 text-pink-700 border-pink-200 font-medium">♀ Hembra</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {calcularEdad(m.fechaNacimiento)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {m.peso ? `${m.peso} kg` : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <NuevaMascotaWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onCreated={fetchMascotas}
      />
    </div>
  )
}
