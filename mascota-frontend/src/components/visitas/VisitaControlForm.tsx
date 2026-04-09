import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createVisita } from '@/api/visitas'
import type { Visita } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  mascotaId: number
  mascotaNombre: string
  onCreated?: (visita: Visita) => void
}

interface FormState {
  motivo: string
  diagnostico: string
  tratamiento: string
  observaciones: string
  pesoActual: string
  veterinario: string
  fecha: string
}

const EMPTY_FORM: FormState = {
  motivo: '',
  diagnostico: '',
  tratamiento: '',
  observaciones: '',
  pesoActual: '',
  veterinario: '',
  fecha: '',
}

export default function VisitaControlForm({
  open,
  onOpenChange,
  mascotaId,
  mascotaNombre,
  onCreated,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setForm(EMPTY_FORM)
    onOpenChange(isOpen)
  }

  const handleSubmit = async () => {
    if (!form.motivo.trim()) {
      toast.error('El motivo es requerido')
      return
    }
    if (!form.veterinario.trim()) {
      toast.error('El veterinario es requerido')
      return
    }
    setSaving(true)
    try {
      const res = await createVisita({
        motivo: form.motivo,
        diagnostico: form.diagnostico,
        tratamiento: form.tratamiento,
        observaciones: form.observaciones,
        pesoActual: form.pesoActual ? parseFloat(form.pesoActual) : 0,
        veterinario: form.veterinario,
        mascotaId,
        ...(form.fecha ? { fecha: form.fecha } : {}),
      })
      if (res.success) {
        toast.success('Visita registrada exitosamente')
        onCreated?.(res.data)
        handleOpen(false)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar visita')
    } finally {
      setSaving(false)
    }
  }

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Visita de Control —{' '}
            <span className="text-primary">{mascotaNombre}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-1">
            <Label htmlFor="v-motivo">
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="v-motivo"
              value={form.motivo}
              onChange={set('motivo')}
              placeholder="Motivo de la consulta"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="v-diagnostico">Diagnóstico</Label>
            <Textarea
              id="v-diagnostico"
              value={form.diagnostico}
              onChange={set('diagnostico')}
              placeholder="Diagnóstico del paciente"
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="v-tratamiento">Tratamiento</Label>
            <Textarea
              id="v-tratamiento"
              value={form.tratamiento}
              onChange={set('tratamiento')}
              placeholder="Tratamiento indicado"
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="v-observaciones">Observaciones</Label>
            <Textarea
              id="v-observaciones"
              value={form.observaciones}
              onChange={set('observaciones')}
              placeholder="Observaciones adicionales"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="v-peso">Peso actual (kg)</Label>
              <Input
                id="v-peso"
                type="number"
                step="0.01"
                min="0"
                value={form.pesoActual}
                onChange={set('pesoActual')}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="v-fecha">Fecha (opcional)</Label>
              <Input
                id="v-fecha"
                type="datetime-local"
                value={form.fecha}
                onChange={set('fecha')}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="v-veterinario">
              Veterinario <span className="text-destructive">*</span>
            </Label>
            <Input
              id="v-veterinario"
              value={form.veterinario}
              onChange={set('veterinario')}
              placeholder="Nombre del veterinario"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Registrar visita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
