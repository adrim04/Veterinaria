export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  tipo: string
  username: string
}

export interface Especie {
  id: number
  nombre: string
  razas: Raza[]
}

export interface Raza {
  id: number
  nombre: string
  especieId: number
  especieNombre: string
}

export interface Propietario {
  id: number
  nombre: string
  apellido: string
  telefono: string
  correo: string
  direccion: string
  ci: string
}

export interface Mascota {
  id: number
  nombre: string
  fechaNacimiento: string
  sexo: string
  peso: number
  color: string
  notas: string
  propietario: Propietario
  especie: Especie
  raza: Raza
}

export interface Visita {
  id: number
  fecha: string
  motivo: string
  diagnostico: string
  tratamiento: string
  observaciones: string
  pesoActual: number
  veterinario: string
  mascotaId: number
  mascotaNombre: string
}

export interface DashboardStats {
  totalMascotas: number
  totalPropietarios: number
  visitasMesActual: number
  mascotasPorEspecie: { nombreEspecie: string; cantidad: number }[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
