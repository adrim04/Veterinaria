import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Search, Plus, Pencil, Trash2, Users, Loader2 } from 'lucide-react'
import {
  getPropietarios,
  searchPropietarios,
  createPropietario,
  updatePropietario,
  deletePropietario,
} from '@/api/propietarios'
import type { Propietario } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const EMPTY_FORM: Omit<Propietario, 'id'> = {
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  direccion: '',
  ci: '',
}

export default function PropietariosTab() {
  const [propietarios, setPropietarios] = useState<Propietario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searching, setSearching] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Propietario | null>(null)
  const [form, setForm] = useState<Omit<Propietario, 'id'>>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Propietario | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadAll = () => {
    setLoading(true)
    getPropietarios()
      .then((res) => {
        if (res.success) setPropietarios(res.data)
        else toast.error(res.message)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      loadAll()
      return
    }
    setSearching(true)
    searchPropietarios({ nombre: searchTerm })
      .then((res) => {
        if (res.success) setPropietarios(res.data)
        else toast.error(res.message)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setSearching(false))
  }

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (p: Propietario) => {
    setEditTarget(p)
    setForm({
      nombre: p.nombre,
      apellido: p.apellido,
      telefono: p.telefono,
      correo: p.correo,
      direccion: p.direccion,
      ci: p.ci,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.apellido.trim()) {
      toast.error('Nombre y apellido son requeridos')
      return
    }
    setSaving(true)
    try {
      if (editTarget) {
        const res = await updatePropietario(editTarget.id, form)
        if (res.success) {
          toast.success('Propietario actualizado')
          setPropietarios((prev) =>
            prev.map((p) => (p.id === editTarget.id ? res.data : p))
          )
          setDialogOpen(false)
        } else {
          toast.error(res.message)
        }
      } else {
        const res = await createPropietario(form)
        if (res.success) {
          toast.success('Propietario creado')
          setPropietarios((prev) => [...prev, res.data])
          setDialogOpen(false)
        } else {
          toast.error(res.message)
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await deletePropietario(deleteTarget.id)
      if (res.success) {
        toast.success('Propietario eliminado')
        setPropietarios((prev) => prev.filter((p) => p.id !== deleteTarget.id))
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
          <h2 className="text-2xl font-bold">Propietarios</h2>
          <p className="text-muted-foreground text-sm">Gestión de clientes y propietarios</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Propietario
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={handleSearch} disabled={searching}>
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
            </Button>
            {searchTerm && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm('')
                  loadAll()
                }}
              >
                Limpiar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : propietarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium">No hay propietarios registrados</p>
              <p className="text-sm">Haga clic en "Nuevo Propietario" para agregar uno</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CI</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propietarios.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">{p.ci || '—'}</TableCell>
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell>{p.apellido}</TableCell>
                    <TableCell>{p.telefono || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.correo || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(p)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(p)}
                          className="text-destructive hover:text-destructive"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editTarget ? 'Editar Propietario' : 'Nuevo Propietario'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="p-nombre">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="p-nombre"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Nombre"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="p-apellido">
                  Apellido <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="p-apellido"
                  value={form.apellido}
                  onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
                  placeholder="Apellido"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-ci">Carnet de Identidad</Label>
              <Input
                id="p-ci"
                value={form.ci}
                onChange={(e) => setForm((f) => ({ ...f, ci: e.target.value }))}
                placeholder="CI"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-telefono">Teléfono</Label>
              <Input
                id="p-telefono"
                value={form.telefono}
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                placeholder="Teléfono"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-correo">Correo electrónico</Label>
              <Input
                id="p-correo"
                type="email"
                value={form.correo}
                onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="p-direccion">Dirección</Label>
              <Input
                id="p-direccion"
                value={form.direccion}
                onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                placeholder="Dirección"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {editTarget ? 'Guardar cambios' : 'Crear propietario'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar propietario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará a{' '}
              <strong>
                {deleteTarget?.nombre} {deleteTarget?.apellido}
              </strong>{' '}
              permanentemente. Esta acción no se puede deshacer.
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
