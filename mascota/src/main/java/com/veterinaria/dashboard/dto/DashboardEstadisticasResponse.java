package com.veterinaria.dashboard.dto;

import java.util.List;

public record DashboardEstadisticasResponse(
    long totalMascotas,
    long totalPropietarios,
    long visitasMesActual,
    List<EspecieConteoResponse> mascotasPorEspecie
) {

    public record EspecieConteoResponse(
        String nombreEspecie,
        long cantidad
    ) {
    }
}
