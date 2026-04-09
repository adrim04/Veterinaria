import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Search, Loader2, CheckCircle2, UserPlus, User } from 'lucide-react'
import { searchPropietarios, createPropietario } from '@/api/propietarios'
import { getEspecies } from '@/api/especies'
import { getRazas } from '@/api/razas'
import { createMascota } from '@/api/mascotas'
import { createVisita } from '@/api/visitas'
import type { Especie, Propietario, Raza } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

type Step = 1 | 2 | 3

interface PropietarioForm {
  nombre: string
  apellido: string
  telefono: string
  correo: string
  direccion: string
  ci: string
}

interface MascotaForm {
  nombre: string
  fechaNacimiento: string
  sexo: string
  especieId: string
  razaId: string
  peso: string
  color: string
  notas: string
}

interface VisitaForm {
  motivo: string
  diagnostico: string
  tratamiento: string
  observaciones: string
  pesoActual: string
  veterinario: string
}

const EMPTY_PROP: PropietarioForm = {
  nombre: '', apellido: '', telefono: '', correo: '', direccion: '', ci: '',
}

const EMPTY_MASCOTA: MascotaForm = {
  nombre: '', fechaNacimiento: '', sexo: 'M', especieId: '', razaId: '',
  peso: '', color: '', notas: '',
}

const EMPTY_VISITA: VisitaForm = {
  motivo: '', diagnostico: '', tratamiento: '',
  observaciones: '', pesoActual: '', veterinario: '',
}

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { num: 1, label: 'Propietario' },
    { num: 2, label: 'Mascota' },
    { num: 3, label: 'Visita inicial' },
  ]
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-2">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              current === s.num
                ? 'bg-primary text-primary-foreground'
                : current > s.num
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {current > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
          </div>
          <span
            className={cn(
              'text-xs font-medium hidden sm:inline',
              current === s.num ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'w-8 h-px',
                current > s.num ? 'bg-green-500' : 'bg-border'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function NuevaMascotaWizard({ open, onOpenChange, onCreated }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)

  // Step 1
  const [searchTerm, setSearchTerm] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Propietario[]>([])
  const [selectedPropietario, setSelectedPropietario] = useState<Propietario | null>(null)
  const [newPropietario, setNewPropietario] = useState(false)
  const [propForm, setPropForm] = useState<PropietarioForm>(EMPTY_PROP)

  // Step 2
  const [mascotaForm, setMascotaForm] = useState<MascotaForm>(EMPTY_MASCOTA)
  const [especies, setEspecies] = useState<Especie[]>([])
  const [razas, setRazas] = useState<Raza[]>([])
  const [loadingRazas, setLoadingRazas] = useState(false)

  // Step 3
  const [visitaForm, setVisitaForm] = useState<VisitaForm>(EMPTY_VISITA)

  useEffect(() => {
    if (open) {
      setStep(1)
      setSearchTerm('')
      setSearchResults([])
      setSelectedPropietario(null)
      setNewPropietario(false)
      setPropForm(EMPTY_PROP)
      setMascotaForm(EMPTY_MASCOTA)
      setVisitaForm(EMPTY_VISITA)
      getEspecies()
        .then((res) => { if (res.success) setEspecies(res.data) })
        .catch(() => {})
    }
  }, [open])

  useEffect(() => {
    if (mascotaForm.especieId) {
      setLoadingRazas(true)
      setMascotaForm((f) => ({ ...f, razaId: '' }))
      getRazas(parseInt(mascotaForm.especieId))
        .then((res) => { if (res.success) setRazas(res.data) })
        .catch(() => {})
        .finally(() => setLoadingRazas(false))
    } else {
      setRazas([])
    }
  }, [mascotaForm.especieId])

  const handleSearch = () => {
    if (!searchTerm.trim()) return
    setSearching(true)
    searchPropietarios({ nombre: searchTerm })
      .then((res) => {
        if (res.success) setSearchResults(res.data)
        else toast.error(res.message)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setSearching(false))
  }

  const validateStep1 = () => {
    if (!selectedPropietario && !newPropietario) {
      toast.error('Seleccione o cree un propietario')
      return false
    }
    if (newPropietario && (!propForm.nombre.trim() || !propForm.apellido.trim())) {
      toast.error('Nombre y apellido del propietario son requeridos')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!mascotaForm.nombre.trim()) { toast.error('El nombre de la mascota es requerido'); return false }
    if (!mascotaForm.especieId) { toast.error('Seleccione una especie'); return false }
    return true
  }

  const validateStep3 = () => {
    if (!visitaForm.motivo.trim()) { toast.error('El motivo de la visita es requerido'); return false }
    if (!visitaForm.veterinario.trim()) { toast.error('El nombre del veterinario es requerido'); return false }
    return true
  }

  const handleFinish = async () => {
    if (!validateStep3()) return
    setSubmitting(true)
    try {
      // 1. Create or use propietario
      let propietarioId: number
      if (selectedPropietario) {
        propietarioId = selectedPropietario.id
      } else {
        const propRes = await createPropietario(propForm)
        if (!propRes.success) throw new Error(propRes.message)
        propietarioId = propRes.data.id
      }

      // 2. Create mascota
      const mascotaRes = await createMascota({
        nombre: mascotaForm.nombre,
        fechaNacimiento: mascotaForm.fechaNacimiento || new Date().toISOString().split('T')[0],
        sexo: mascotaForm.sexo,
        peso: mascotaForm.peso ? parseFloat(mascotaForm.peso) : 0,
        color: mascotaForm.color,
        notas: mascotaForm.notas,
        propietarioId,
        especieId: parseInt(mascotaForm.especieId),
        razaId: mascotaForm.razaId ? parseInt(mascotaForm.razaId) : 0,
      })
      if (!mascotaRes.success) throw new Error(mascotaRes.message)

      // 3. Create visita
      const visitaRes = await createVisita({
        motivo: visitaForm.motivo,
        diagnostico: visitaForm.diagnostico,
        tratamiento: visitaForm.tratamiento,
        observaciones: visitaForm.observaciones,
        pesoActual: visitaForm.pesoActual ? parseFloat(visitaForm.pesoActual) : 0,
        veterinario: visitaForm.veterinario,
        mascotaId: mascotaRes.data.id,
      })
      if (!visitaRes.success) throw new Error(visitaRes.message)

      toast.success(`¡Mascota "${mascotaRes.data.nombre}" registrada exitosamente!`)
      onCreated?.()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al registrar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nueva Mascota</DialogTitle>
        </DialogHeader>

        <StepIndicator current={step} />

        <div className="flex-1 overflow-y-auto pr-1">

          {/* STEP 1: PROPIETARIO */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Busque un propietario existente o registre uno nuevo.
              </p>

              {!newPropietario && (
                <>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nombre o CI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-9"
                      />
                    </div>
                    <Button variant="outline" onClick={handleSearch} disabled={searching}>
                      {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                      {searchResults.map((p) => (
                        <button
                          key={p.id}
                          className={cn(
                            'w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center gap-3',
                            selectedPropietario?.id === p.id && 'bg-primary/10'
                          )}
                          onClick={() => setSelectedPropietario(p)}
                        >
                          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">
                              {p.nombre} {p.apellido}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              CI: {p.ci || '—'} · {p.telefono || '—'}
                            </p>
                          </div>
                          {selectedPropietario?.id === p.id && (
                            <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedPropietario && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">
                          {selectedPropietario.nombre} {selectedPropietario.apellido}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          CI: {selectedPropietario.ci || '—'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => setSelectedPropietario(null)}
                      >
                        Cambiar
                      </Button>
                    </div>
                  )}

                  <Separator />

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setNewPropietario(true)
                      setSelectedPropietario(null)
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Crear nuevo propietario
                  </Button>
                </>
              )}

              {newPropietario && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Datos del nuevo propietario</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewPropietario(false)}
                    >
                      ← Volver a búsqueda
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Nombre <span className="text-destructive">*</span></Label>
                      <Input
                        value={propForm.nombre}
                        onChange={(e) => setPropForm((f) => ({ ...f, nombre: e.target.value }))}
                        placeholder="Nombre"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Apellido <span className="text-destructive">*</span></Label>
                      <Input
                        value={propForm.apellido}
                        onChange={(e) => setPropForm((f) => ({ ...f, apellido: e.target.value }))}
                        placeholder="Apellido"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>CI</Label>
                      <Input
                        value={propForm.ci}
                        onChange={(e) => setPropForm((f) => ({ ...f, ci: e.target.value }))}
                        placeholder="Carnet de identidad"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Teléfono</Label>
                      <Input
                        value={propForm.telefono}
                        onChange={(e) => setPropForm((f) => ({ ...f, telefono: e.target.value }))}
                        placeholder="Teléfono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Correo</Label>
                    <Input
                      type="email"
                      value={propForm.correo}
                      onChange={(e) => setPropForm((f) => ({ ...f, correo: e.target.value }))}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Dirección</Label>
                    <Input
                      value={propForm.direccion}
                      onChange={(e) => setPropForm((f) => ({ ...f, direccion: e.target.value }))}
                      placeholder="Dirección"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: MASCOTA */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Complete los datos de la mascota.</p>

              <div className="space-y-1">
                <Label>Nombre <span className="text-destructive">*</span></Label>
                <Input
                  value={mascotaForm.nombre}
                  onChange={(e) => setMascotaForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Nombre de la mascota"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Fecha de nacimiento</Label>
                  <Input
                    type="date"
                    value={mascotaForm.fechaNacimiento}
                    onChange={(e) => setMascotaForm((f) => ({ ...f, fechaNacimiento: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Sexo</Label>
                  <RadioGroup
                    value={mascotaForm.sexo}
                    onValueChange={(v) => setMascotaForm((f) => ({ ...f, sexo: v }))}
                    className="flex gap-4 pt-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="M" id="sexo-m" />
                      <Label htmlFor="sexo-m" className="cursor-pointer">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Macho</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="H" id="sexo-h" />
                      <Label htmlFor="sexo-h" className="cursor-pointer">
                        <Badge className="bg-pink-100 text-pink-700 border-pink-200">Hembra</Badge>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Especie <span className="text-destructive">*</span></Label>
                  <Select
                    value={mascotaForm.especieId}
                    onValueChange={(v) => setMascotaForm((f) => ({ ...f, especieId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar especie" />
                    </SelectTrigger>
                    <SelectContent>
                      {especies.map((e) => (
                        <SelectItem key={e.id} value={String(e.id)}>
                          {e.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Raza</Label>
                  <Select
                    value={mascotaForm.razaId}
                    onValueChange={(v) => setMascotaForm((f) => ({ ...f, razaId: v }))}
                    disabled={!mascotaForm.especieId || loadingRazas}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingRazas ? 'Cargando...' : 'Seleccionar raza'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {razas.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={mascotaForm.peso}
                    onChange={(e) => setMascotaForm((f) => ({ ...f, peso: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Color</Label>
                  <Input
                    value={mascotaForm.color}
                    onChange={(e) => setMascotaForm((f) => ({ ...f, color: e.target.value }))}
                    placeholder="Color del pelaje"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Notas adicionales</Label>
                <Textarea
                  value={mascotaForm.notas}
                  onChange={(e) => setMascotaForm((f) => ({ ...f, notas: e.target.value }))}
                  placeholder="Observaciones sobre la mascota..."
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* STEP 3: VISITA */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Registre la primera visita de <strong>{mascotaForm.nombre}</strong>.
              </p>

              <div className="space-y-1">
                <Label>Motivo <span className="text-destructive">*</span></Label>
                <Input
                  value={visitaForm.motivo}
                  onChange={(e) => setVisitaForm((f) => ({ ...f, motivo: e.target.value }))}
                  placeholder="Motivo de la consulta"
                />
              </div>
              <div className="space-y-1">
                <Label>Diagnóstico</Label>
                <Textarea
                  value={visitaForm.diagnostico}
                  onChange={(e) => setVisitaForm((f) => ({ ...f, diagnostico: e.target.value }))}
                  rows={2}
                  placeholder="Diagnóstico"
                />
              </div>
              <div className="space-y-1">
                <Label>Tratamiento</Label>
                <Textarea
                  value={visitaForm.tratamiento}
                  onChange={(e) => setVisitaForm((f) => ({ ...f, tratamiento: e.target.value }))}
                  rows={2}
                  placeholder="Tratamiento indicado"
                />
              </div>
              <div className="space-y-1">
                <Label>Observaciones</Label>
                <Textarea
                  value={visitaForm.observaciones}
                  onChange={(e) => setVisitaForm((f) => ({ ...f, observaciones: e.target.value }))}
                  rows={2}
                  placeholder="Observaciones adicionales"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Peso actual (kg)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={visitaForm.pesoActual}
                    onChange={(e) => setVisitaForm((f) => ({ ...f, pesoActual: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Veterinario <span className="text-destructive">*</span></Label>
                  <Input
                    value={visitaForm.veterinario}
                    onChange={(e) => setVisitaForm((f) => ({ ...f, veterinario: e.target.value }))}
                    placeholder="Nombre del veterinario"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (step === 1) onOpenChange(false)
              else setStep((s) => (s - 1) as Step)
            }}
            disabled={submitting}
          >
            {step === 1 ? 'Cancelar' : '← Atrás'}
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => {
                if (step === 1 && !validateStep1()) return
                if (step === 2 && !validateStep2()) return
                setStep((s) => (s + 1) as Step)
              }}
            >
              Siguiente →
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={submitting}>
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registrando...</>
              ) : (
                'Finalizar registro'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
