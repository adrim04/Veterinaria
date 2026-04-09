import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  PawPrint, Phone, Mail, MapPin, CreditCard, Weight,
  Stethoscope, Calendar, Trash2, Plus, ChevronDown, ChevronUp,
  User, Palette, FileText, ClipboardList,
} from 'lucide-react'
import { getVisitasByMascota, deleteVisita } from '@/api/visitas'
import { deleteMascota } from '@/api/mascotas'
import type { Mascota, Visita } from '@/types'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import VisitaControlForm from '@/components/visitas/VisitaControlForm'

interface Props {
  mascota: Mascota
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated?: () => void
}

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

function VisitaCard({ visita, onDelete }: { visita: Visita; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await deleteVisita(visita.id)
      if (res.success) {
        toast.success('Visita eliminada')
        onDelete()
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/40 transition-colors"
          onClick={() => setExpanded((e) => !e)}
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{visita.motivo}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {formatFecha(visita.fecha)}
              {visita.veterinario && (
                <span className="ml-2">· Dr. {visita.veterinario}</span>
              )}
            </p>
          </div>
          {visita.pesoActual ? (
            <Badge variant="outline" className="text-xs shrink-0">
              <Weight className="w-3 h-3 mr-1" />
              {visita.pesoActual} kg
            </Badge>
          ) : null}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
        </div>

        {/* Expanded body */}
        {expanded && (
          <div className="border-t px-3 pb-3 pt-2 space-y-2 bg-muted/20">
            {visita.diagnostico && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Diagnóstico</p>
                <p className="text-sm mt-0.5">{visita.diagnostico}</p>
              </div>
            )}
            {visita.tratamiento && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tratamiento</p>
                <p className="text-sm mt-0.5">{visita.tratamiento}</p>
              </div>
            )}
            {visita.observaciones && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Observaciones</p>
                <p className="text-sm mt-0.5">{visita.observaciones}</p>
              </div>
            )}
            <div className="flex justify-end pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setConfirmDelete(true)}
                disabled={deleting}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Eliminar visita
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta visita?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el registro de la visita del <strong>{formatFecha(visita.fecha)}</strong>. Esta acción no se puede deshacer.
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

export default function MascotaDetailSheet({ mascota, open, onOpenChange, onUpdated }: Props) {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loadingVisitas, setLoadingVisitas] = useState(false)
  const [showVisitaForm, setShowVisitaForm] = useState(false)
  const [confirmDeleteMascota, setConfirmDeleteMascota] = useState(false)
  const [deletingMascota, setDeletingMascota] = useState(false)

  const fetchVisitas = async () => {
    setLoadingVisitas(true)
    try {
      const res = await getVisitasByMascota(mascota.id)
      if (res.success) setVisitas(res.data)
    } catch {
      // silent
    } finally {
      setLoadingVisitas(false)
    }
  }

  useEffect(() => {
    if (open) fetchVisitas()
  }, [open, mascota.id])

  const handleDeleteMascota = async () => {
    setDeletingMascota(true)
    try {
      const res = await deleteMascota(mascota.id)
      if (res.success) {
        toast.success(`Mascota "${mascota.nombre}" eliminada`)
        onUpdated?.()
        onOpenChange(false)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    } finally {
      setDeletingMascota(false)
      setConfirmDeleteMascota(false)
    }
  }

  const p = mascota.propietario

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-xl w-full flex flex-col p-0 gap-0">
          {/* Sheet header */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <PawPrint className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl">{mascota.nombre}</SheetTitle>
                <SheetDescription className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={ESPECIE_COLORS[mascota.especie?.nombre] ?? ''}
                  >
                    {mascota.especie?.nombre}
                  </Badge>
                  <span className="text-muted-foreground">·</span>
                  <span>{mascota.raza?.nombre}</span>
                  {mascota.sexo === 'M' && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">♂ Macho</Badge>
                  )}
                  {mascota.sexo === 'H' && (
                    <Badge className="bg-pink-100 text-pink-700 border-pink-200 text-xs">♀ Hembra</Badge>
                  )}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-5">

              {/* Mascota info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {mascota.fechaNacimiento && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Edad</p>
                      <p className="font-medium">{calcularEdad(mascota.fechaNacimiento)}</p>
                    </div>
                  </div>
                )}
                {mascota.peso ? (
                  <div className="flex items-start gap-2">
                    <Weight className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Peso</p>
                      <p className="font-medium">{mascota.peso} kg</p>
                    </div>
                  </div>
                ) : null}
                {mascota.color && (
                  <div className="flex items-start gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Color</p>
                      <p className="font-medium">{mascota.color}</p>
                    </div>
                  </div>
                )}
                {mascota.notas && (
                  <div className="flex items-start gap-2 col-span-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Notas</p>
                      <p className="font-medium">{mascota.notas}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Propietario */}
              {p && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Propietario
                    </p>
                    <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">
                          {p.nombre} {p.apellido}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          {p.ci && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <CreditCard className="w-3 h-3" /> {p.ci}
                            </span>
                          )}
                          {p.telefono && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {p.telefono}
                            </span>
                          )}
                          {p.correo && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {p.correo}
                            </span>
                          )}
                          {p.direccion && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {p.direccion}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Historial de visitas */}
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Historial de visitas
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {visitas.length} visita{visitas.length !== 1 ? 's' : ''} registrada{visitas.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowVisitaForm(true)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Agregar visita
                  </Button>
                </div>

                {loadingVisitas ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                  </div>
                ) : visitas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center border rounded-lg bg-muted/20">
                    <ClipboardList className="w-10 h-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">Sin visitas registradas</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Registra la primera visita de control
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {visitas.map((v) => (
                      <VisitaCard
                        key={v.id}
                        visita={v}
                        onDelete={fetchVisitas}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDeleteMascota(true)}
              disabled={deletingMascota}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Eliminar mascota
            </Button>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Visita control form */}
      <VisitaControlForm
        open={showVisitaForm}
        onOpenChange={setShowVisitaForm}
        mascotaId={mascota.id}
        mascotaNombre={mascota.nombre}
        onCreated={() => fetchVisitas()}
      />

      {/* Confirm delete mascota */}
      <AlertDialog open={confirmDeleteMascota} onOpenChange={setConfirmDeleteMascota}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar a {mascota.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el registro de <strong>{mascota.nombre}</strong> y todos sus datos asociados.
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
    </>
  )
}
