import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dog, Users, CalendarDays, TrendingUp } from 'lucide-react'
import { getDashboardStats } from '@/api/dashboard'
import type { DashboardStats } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Pie, PieChart, Label } from 'recharts'
import React from 'react'

const ESPECIE_COLORS: Record<string, string> = {
  Canino: 'var(--chart-1)',
  Felino: 'var(--chart-2)',
  Ave: 'var(--chart-3)',
  Roedor: 'var(--chart-4)',
}

function getColor(name: string, index: number): string {
  return ESPECIE_COLORS[name] ?? `var(--chart-${(index % 5) + 1})`
}

export default function DashboardTab() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        if (res.success) setStats(res.data)
        else toast.error(res.message)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  const chartData = (stats?.mascotasPorEspecie ?? []).map((item, i) => ({
    name: item.nombreEspecie,
    value: item.cantidad,
    fill: getColor(item.nombreEspecie, i),
  }))

  const chartConfig: ChartConfig = Object.fromEntries(
    chartData.map((item) => [
      item.name,
      { label: item.name, color: item.fill },
    ])
  )

  const totalMascotasChart = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.value, 0),
    [chartData]
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Resumen del sistema veterinario</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Mascotas
                </CardTitle>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dog className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalMascotas ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Pacientes registrados</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-400">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Propietarios
                </CardTitle>
                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalPropietarios ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Clientes registrados</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-400">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Visitas este mes
                </CardTitle>
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.visitasMesActual ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Consultas del mes actual</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="items-center pb-0">
            <CardTitle>Mascotas por Especie</CardTitle>
            <CardDescription>Distribución de pacientes</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Skeleton className="w-40 h-40 rounded-full" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Dog className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">Sin datos de especies</p>
              </div>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[280px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    strokeWidth={4}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalMascotasChart.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground text-xs"
                              >
                                Total
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2"
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalle por Especie</CardTitle>
            <CardDescription>Conteo de pacientes registrados</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">No hay datos disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {item.value}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${totalMascotasChart > 0 ? (item.value / totalMascotasChart) * 100 : 0}%`,
                            backgroundColor: item.fill,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">
                    Total: <span className="font-bold text-foreground">{totalMascotasChart}</span> mascotas
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
