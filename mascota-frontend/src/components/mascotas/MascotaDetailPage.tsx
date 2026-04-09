import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  ArrowLeft, PawPrint, Phone, Mail, MapPin, CreditCard,
  Weight, Calendar, Trash2, Plus, ChevronDown, ChevronUp,
  User, Palette, FileText, ClipboardList, Stethoscope,
} from 'lucide-react'
import { getVisitasByMascota, deleteVisita } from '@/api/visitas'
import { deleteMascota } from '@/api/mascotas'
import type { Mascota, Visita } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import VisitaControlForm from '@/components/visitas/VisitaControlForm'

interface Props {
  mascota: Mascota
  onBack: () => void
  onDeleted: () => void
}

const ESPECIE_COLORS: Record<string, string> = {
  Canino: 'bg-blue-100 text-blue-700 border-blue-200',
  Felino: 'bg-orange-100 text-orange-700 border-orange-200',
  Ave:    'bg-green-100 text-green-700 border-green-200',
  Roedor: 'bg-purple-100 text-purple-700 border-purple-200',
}

function calcularEdad(fechaNacimiento: string): string {
  if (!fechaNacimiento) return '—'
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  const meses =
    (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth())
  if (meses < 1) return 'Recién nacido'
  if (meses < 12) return `${meses} mes${meses > 1 ? 'es' : ''}`
  const años = Math.floor(meses / 12)
  const mesesR = meses % 12
  return mesesR > 0 ? `${años}a ${mesesR}m` : `${años} año${años > 1 ? 's' : ''}`
}

function formatFecha(fecha: string): string {
  try {
    return format(new Date(fecha), "d 'de' MMMM yyyy, HH:mm", { locale: es })
  } catch {
    return fecha
  }
}

// ─── Visita card ─────────────────────────────────────────────────────────────
function VisitaCard({ visita, onDelete }: { visita: Visita; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [confirm, setConfirm]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await deleteVisita(visita.id)
      if (res.success) { toast.success('Visita eliminada'); onDelete() }
      else toast.error(res.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    } finally { setDeleting(false); setConfirm(false) }
  }

  const hasDetails = visita.diagnostico || visita.tratamiento || visita.observaciones

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header row */}
        <div
          className={`flex items-center gap-3 p-4 ${hasDetails ? 'cursor-pointer hover:bg-muted/40 transition-colors' : ''}`}
          onClick={() => hasDetails && setExpanded((e) => !e)}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{visita.motivo}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatFecha(visita.fecha)}
              </span>
              {visita.veterinario && (
                <span className="text-xs text-muted-foreground">
                  Dr. {visita.veterinario}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {visita.pesoActual ? (
              <Badge variant="outline" className="text-xs">
                <Weight className="w-3 h-3 mr-1" />{visita.pesoActual} kg
              </Badge>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => { e.stopPropagation(); setConfirm(true) }}
              disabled={deleting}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
            {hasDetails && (
              expanded
                ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                : <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Expanded details */}
        {expanded && hasDetails && (
          <CardContent className="pt-0 pb-4 border-t bg-muted/20">
            <div className="grid sm:grid-cols-2 gap-4 mt-3">
              {visita.diagnostico && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Diagnóstico</p>
                  <p className="text-sm">{visita.diagnostico}</p>
                </div>
              )}
              {visita.tratamiento && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Tratamiento</p>
                  <p className="text-sm">{visita.tratamiento}</p>
                </div>
              )}
              {visita.observaciones && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Observaciones</p>
                  <p className="text-sm">{visita.observaciones}</p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta visita?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el registro del <strong>{formatFecha(visita.fecha)}</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MascotaDetailPage({ mascota, onBack, onDeleted }: Props) {
  const [visitas, setVisitas]           = useState<Visita[]>([])
  const [loadingVisitas, setLoading]    = useState(false)
  const [showVisitaForm, setVisitaForm] = useState(false)
  const [confirmDel, setConfirmDel]     = useState(false)
  const [deleting, setDeleting]         = useState(false)

  const fetchVisitas = async () => {
    setLoading(true)
    try {
      const res = await getVisitasByMascota(mascota.id)
      if (res.success) setVisitas(res.data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchVisitas() }, [mascota.id])

  const handleDeleteMascota = async () => {
    setDeleting(true)
    try {
      const res = await deleteMascota(mascota.id)
      if (res.success) {
        toast.success(`Mascota "${mascota.nombre}" eliminada`)
        onDeleted()
      } else toast.error(res.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    } finally { setDeleting(false); setConfirmDel(false) }
  }

  const p = mascota.propietario

  return (
    <div className="space-y-6">
      {/* Breadcrumb / back */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 pl-1">
          <ArrowLeft className="w-4 h-4" />
          Mascotas
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold">{mascota.nombre}</span>
        <Badge variant="outline" className={`ml-1 ${ESPECIE_COLORS[mascota.especie?.nombre] ?? ''}`}>
          {mascota.especie?.nombre}
        </Badge>
        {mascota.sexo === 'M' && <Badge className="bg-blue-100 text-blue-700 border-blue-200">♂ Macho</Badge>}
        {mascota.sexo === 'H' && <Badge className="bg-pink-100 text-pink-700 border-pink-200">♀ Hembra</Badge>}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Left: ficha + propietario ── */}
        <div className="space-y-4 lg:col-span-1">

          {/* Ficha clínica */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-primary" />
                </div>
                Ficha clínica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {mascota.raza && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Raza</p>
                    <p className="font-medium">{mascota.raza.nombre}</p>
                  </div>
                )}
                {mascota.fechaNacimiento && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Edad</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {calcularEdad(mascota.fechaNacimiento)}
                    </p>
                  </div>
                )}
                {mascota.peso ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Peso</p>
                    <p className="font-medium flex items-center gap-1">
                      <Weight className="w-3.5 h-3.5 text-muted-foreground" />
                      {mascota.peso} kg
                    </p>
                  </div>
                ) : null}
                {mascota.color && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Color</p>
                    <p className="font-medium flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                      {mascota.color}
                    </p>
                  </div>
                )}
              </div>
              {mascota.fechaNacimiento && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Fecha de nacimiento</p>
                  <p className="font-medium text-xs">
                    {format(new Date(mascota.fechaNacimiento), 'd MMM yyyy', { locale: es })}
                  </p>
                </div>
              )}
              {mascota.notas && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Notas
                    </p>
                    <p className="text-sm">{mascota.notas}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Propietario */}
          {p && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  Propietario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-semibold text-base">{p.nombre} {p.apellido}</p>
                {p.ci && (
                  <p className="flex items-center gap-2 text-muted-foreground text-xs">
                    <CreditCard className="w-3.5 h-3.5 shrink-0" /> CI: {p.ci}
                  </p>
                )}
                {p.telefono && (
                  <p className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Phone className="w-3.5 h-3.5 shrink-0" /> {p.telefono}
                  </p>
                )}
                {p.correo && (
                  <p className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Mail className="w-3.5 h-3.5 shrink-0" /> {p.correo}
                  </p>
                )}
                {p.direccion && (
                  <p className="flex items-center gap-2 text-muted-foreground text-xs">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {p.direccion}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Delete mascota */}
          <Button
            variant="outline"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setConfirmDel(true)}
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar mascota
          </Button>
        </div>

        {/* ── Right: historial de visitas ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Historial de visitas
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {loadingVisitas
                  ? 'Cargando...'
                  : `${visitas.length} visita${visitas.length !== 1 ? 's' : ''} registrada${visitas.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <Button onClick={() => setVisitaForm(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Agregar visita
            </Button>
          </div>

          {loadingVisitas ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : visitas.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ClipboardList className="w-12 h-12 text-muted-foreground/25 mb-3" />
                <p className="font-medium text-muted-foreground">Sin visitas registradas</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Registra la primera visita de {mascota.nombre} usando el botón de arriba
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {visitas.map((v) => (
                <VisitaCard key={v.id} visita={v} onDelete={fetchVisitas} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Visita control form */}
      <VisitaControlForm
        open={showVisitaForm}
        onOpenChange={setVisitaForm}
        mascotaId={mascota.id}
        mascotaNombre={mascota.nombre}
        onCreated={() => fetchVisitas()}
      />

      {/* Confirm delete mascota */}
      <AlertDialog open={confirmDel} onOpenChange={setConfirmDel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar a {mascota.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el registro de <strong>{mascota.nombre}</strong> y todos sus datos.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMascota}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
