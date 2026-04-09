package com.veterinaria.visita.dto;

import java.time.LocalDateTime;

public record VisitaResponse(
    Integer id,
    LocalDateTime fecha,
    String motivo,
    String diagnostico,
    String tratamiento,
    String observaciones,
    Double pesoActual,
    String veterinario,
    Integer mascotaId,
    String mascotaNombre
) {
}
