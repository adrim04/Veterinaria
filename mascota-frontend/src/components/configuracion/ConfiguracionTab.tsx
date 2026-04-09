import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Plus, Loader2, UserCog, Tag, Dna, KeyRound, Eye, EyeOff, Trash2, ShieldAlert } from 'lucide-react'
import { getEspecies, createEspecie } from '@/api/especies'
import { getRazas, createRaza } from '@/api/razas'
import { getUsuarios, createUsuario, deleteUsuario } from '@/api/usuarios'
import type { UsuarioItem } from '@/api/usuarios'
import type { Especie, Raza } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

// ─── USUARIOS ──────────────────────────────────────────────────────────────
function UsuariosSection() {
  const [usuarios, setUsuarios]   = useState<UsuarioItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [toDelete, setToDelete]   = useState<UsuarioItem | null>(null)
  const [deleting, setDeleting]   = useState(false)

  const fetchUsuarios = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUsuarios()
      if (res.success) setUsuarios(res.data)
    } catch { /* silent */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchUsuarios() }, [fetchUsuarios])

  const handleCreate = async () => {
    if (!username.trim()) { toast.error('El usuario es requerido'); return }
    if (password.length < 4) { toast.error('La contraseña debe tener al menos 4 caracteres'); return }
    setSaving(true)
    try {
      const res = await createUsuario({ username, password })
      if (res.success) {
        toast.success(`Usuario "${username}" creado exitosamente`)
        setUsername(''); setPassword(''); setShowForm(false)
        fetchUsuarios()
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear usuario')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      const res = await deleteUsuario(toDelete.id)
      if (res.success) {
        toast.success(`Usuario "${toDelete.username}" eliminado`)
        fetchUsuarios()
      } else toast.error(res.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    } finally { setDeleting(false); setToDelete(null) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Usuarios del sistema</p>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Cargando...' : `${usuarios.length} usuario${usuarios.length !== 1 ? 's' : ''} registrado${usuarios.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo usuario
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium font-mono">{u.username}</TableCell>
                  <TableCell>
                    {u.username === 'admin'
                      ? <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs flex items-center gap-1 w-fit"><ShieldAlert className="w-3 h-3" />Administrador</Badge>
                      : <Badge variant="outline" className="text-xs">Usuario</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    {u.username !== 'admin' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setToDelete(u)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create user dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cfg-username">
                Nombre de usuario <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cfg-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej: veterinario1"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cfg-password">
                Contraseña <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="cfg-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <KeyRound className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">
                La contraseña se almacena de forma segura usando BCrypt. No se puede recuperar una vez creada.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete user */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => { if (!o) setToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario "{toDelete?.username}"?</AlertDialogTitle>
            <AlertDialogDescription>
              El usuario perderá acceso al sistema inmediatamente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── ESPECIES ──────────────────────────────────────────────────────────────
function EspeciesSection() {
  const [especies, setEspecies] = useState<Especie[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchEspecies = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getEspecies()
      if (res.success) setEspecies(res.data)
    } catch { /* silent */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchEspecies() }, [fetchEspecies])

  const handleCreate = async () => {
    if (!nombre.trim()) { toast.error('El nombre es requerido'); return }
    setSaving(true)
    try {
      const res = await createEspecie(nombre.trim())
      if (res.success) {
        toast.success(`Especie "${nombre}" creada`)
        setNombre(''); setShowForm(false); fetchEspecies()
      } else { toast.error(res.message) }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Especies</p>
          <p className="text-sm text-muted-foreground">Tipos de animales registrados</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Nueva especie
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Razas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {especies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No hay especies registradas
                  </TableCell>
                </TableRow>
              ) : (
                especies.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground text-sm">{e.id}</TableCell>
                    <TableCell className="font-medium">{e.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{e.razas?.length ?? 0} raza{(e.razas?.length ?? 0) !== 1 ? 's' : ''}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva especie</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Nombre <span className="text-destructive">*</span></Label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej: Reptil, Pez..."
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── RAZAS ──────────────────────────────────────────────────────────────────
function RazasSection() {
  const [razas, setRazas] = useState<Raza[]>([])
  const [especies, setEspecies] = useState<Especie[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [especieId, setEspecieId] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [rRes, eRes] = await Promise.all([getRazas(), getEspecies()])
      if (rRes.success) setRazas(rRes.data)
      if (eRes.success) setEspecies(eRes.data)
    } catch { /* silent */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleCreate = async () => {
    if (!nombre.trim()) { toast.error('El nombre es requerido'); return }
    if (!especieId) { toast.error('Seleccione una especie'); return }
    setSaving(true)
    try {
      const res = await createRaza({ nombre: nombre.trim(), especieId: parseInt(especieId) })
      if (res.success) {
        toast.success(`Raza "${nombre}" creada`)
        setNombre(''); setEspecieId(''); setShowForm(false); fetchAll()
      } else { toast.error(res.message) }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear')
    } finally { setSaving(false) }
  }

  const ESPECIE_COLORS: Record<string, string> = {
    Canino: 'bg-blue-100 text-blue-700 border-blue-200',
    Felino: 'bg-orange-100 text-orange-700 border-orange-200',
    Ave: 'bg-green-100 text-green-700 border-green-200',
    Roedor: 'bg-purple-100 text-purple-700 border-purple-200',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Razas</p>
          <p className="text-sm text-muted-foreground">Razas disponibles por especie</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Nueva raza
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Raza</TableHead>
                <TableHead>Especie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {razas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                    No hay razas registradas
                  </TableCell>
                </TableRow>
              ) : (
                razas.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.nombre}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={ESPECIE_COLORS[r.especieNombre] ?? 'bg-muted'}
                      >
                        {r.especieNombre}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva raza</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Especie <span className="text-destructive">*</span></Label>
              <Select value={especieId} onValueChange={setEspecieId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar especie" />
                </SelectTrigger>
                <SelectContent>
                  {especies.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>{e.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Nombre de la raza <span className="text-destructive">*</span></Label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej: Poodle, Ragdoll..."
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function ConfiguracionTab() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Configuración</h2>
        <p className="text-sm text-muted-foreground">
          Administra usuarios, especies y razas del sistema
        </p>
      </div>

      <Tabs defaultValue="usuarios">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="usuarios" className="flex items-center gap-1.5">
            <UserCog className="w-3.5 h-3.5" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="especies" className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Especies
          </TabsTrigger>
          <TabsTrigger value="razas" className="flex items-center gap-1.5">
            <Dna className="w-3.5 h-3.5" />
            Razas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCog className="w-4 h-4" /> Gestión de usuarios
              </CardTitle>
              <CardDescription>
                Crea usuarios para que puedan acceder al sistema veterinario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsuariosSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="especies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="w-4 h-4" /> Especies registradas
              </CardTitle>
              <CardDescription>
                Tipos de animales que pueden atenderse en la clínica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EspeciesSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="razas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Dna className="w-4 h-4" /> Razas registradas
              </CardTitle>
              <CardDescription>
                Razas disponibles para clasificar las mascotas por especie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RazasSection />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
