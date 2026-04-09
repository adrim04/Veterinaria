import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Search, CalendarDays, ChevronDown, ChevronUp, Pencil, Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { getVisitas, updateVisita, deleteVisita } from '@/api/visitas'
import type { Visita } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'

function safeFormat(dateStr: string) {
  try {
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm')
  } catch {
    return dateStr
  }
}

export default function VisitasTab() {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const [editTarget, setEditTarget] = useState<Visita | null>(null)
  const [editForm, setEditForm] = useState({
    motivo: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    pesoActual: '',
    veterinario: '',
  })
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Visita | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadVisitas = () => {
    setLoading(true)
    getVisitas()
      .then((res) => {
        if (res.success) {
          setVisitas([...res.data].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()))
        } else {
          toast.error(res.message)
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadVisitas()
  }, [])

  const filtered = searchTerm.trim()
    ? visitas.filter((v) =>
        v.mascotaNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.motivo?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : visitas

  const openEdit = (v: Visita) => {
    setEditTarget(v)
    setEditForm({
      motivo: v.motivo ?? '',
      diagnostico: v.diagnostico ?? '',
      tratamiento: v.tratamiento ?? '',
      observaciones: v.observaciones ?? '',
      pesoActual: String(v.pesoActual ?? ''),
      veterinario: v.veterinario ?? '',
    })
  }

  const handleSave = async () => {
    if (!editTarget) return
    if (!editForm.motivo.trim()) {
      toast.error('El motivo es requerido')
      return
    }
    setSaving(true)
    try {
      const res = await updateVisita(editTarget.id, {
        motivo: editForm.motivo,
        diagnostico: editForm.diagnostico,
        tratamiento: editForm.tratamiento,
        observaciones: editForm.observaciones,
        pesoActual: editForm.pesoActual ? parseFloat(editForm.pesoActual) : 0,
        veterinario: editForm.veterinario,
      })
      if (res.success) {
        toast.success('Visita actualizada')
        setVisitas((prev) => prev.map((v) => (v.id === editTarget.id ? res.data : v)))
        setEditTarget(null)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await deleteVisita(deleteTarget.id)
      if (res.success) {
        toast.success('Visita eliminada')
        setVisitas((prev) => prev.filter((v) => v.id !== deleteTarget.id))
        setDeleteTarget(null)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Visitas</h2>
          <p className="text-muted-foreground text-sm">Historial de consultas veterinarias</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por mascota o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {searchTerm && (
              <Button variant="ghost" onClick={() => setSearchTerm('')}>
                Limpiar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <CalendarDays className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium">No hay visitas registradas</p>
              <p className="text-sm">Las visitas aparecerán aquí cuando se registren</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="hidden md:table-cell">Diagnóstico</TableHead>
                  <TableHead className="hidden md:table-cell">Veterinario</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <>
                    <TableRow
                      key={v.id}
                      className="cursor-pointer"
                      onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                    >
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {safeFormat(v.fecha)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {v.mascotaNombre}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{v.motivo}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate text-muted-foreground">
                        {v.diagnostico || '—'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {v.veterinario || '—'}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1 items-center">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                            title="Ver detalles"
                          >
                            {expandedId === v.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(v)}
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteTarget(v)}
                            className="text-destructive hover:text-destructive"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === v.id && (
                      <TableRow key={`${v.id}-expand`}>
                        <TableCell colSpan={6} className="bg-muted/30">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 px-2">
                            {v.diagnostico && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Diagnóstico</p>
                                <p className="text-sm">{v.diagnostico}</p>
                              </div>
                            )}
                            {v.tratamiento && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Tratamiento</p>
                                <p className="text-sm">{v.tratamiento}</p>
                              </div>
                            )}
                            {v.observaciones && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Observaciones</p>
                                <p className="text-sm">{v.observaciones}</p>
                              </div>
                            )}
                            {v.pesoActual != null && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Peso registrado</p>
                                <p className="text-sm font-medium">{v.pesoActual} kg</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Visita</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <Label>Motivo <span className="text-destructive">*</span></Label>
              <Input
                value={editForm.motivo}
                onChange={(e) => setEditForm((f) => ({ ...f, motivo: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Diagnóstico</Label>
              <Textarea
                value={editForm.diagnostico}
                onChange={(e) => setEditForm((f) => ({ ...f, diagnostico: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label>Tratamiento</Label>
              <Textarea
                value={editForm.tratamiento}
                onChange={(e) => setEditForm((f) => ({ ...f, tratamiento: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label>Observaciones</Label>
              <Textarea
                value={editForm.observaciones}
                onChange={(e) => setEditForm((f) => ({ ...f, observaciones: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Peso actual (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.pesoActual}
                  onChange={(e) => setEditForm((f) => ({ ...f, pesoActual: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Veterinario</Label>
                <Input
                  value={editForm.veterinario}
                  onChange={(e) => setEditForm((f) => ({ ...f, veterinario: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta visita?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la visita del{' '}
              {deleteTarget ? safeFormat(deleteTarget.fecha) : ''} de{' '}
              <strong>{deleteTarget?.mascotaNombre}</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
