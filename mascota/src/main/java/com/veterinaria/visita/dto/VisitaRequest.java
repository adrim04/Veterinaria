package com.veterinaria.visita.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record VisitaRequest(
    LocalDateTime fecha,
    @NotBlank String motivo,
    String diagnostico,
    String tratamiento,
    String observaciones,
    Double pesoActual,
    String veterinario,
    @NotNull Integer mascotaId
) {
}
