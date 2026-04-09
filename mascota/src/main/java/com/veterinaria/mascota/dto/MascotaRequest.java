package com.veterinaria.mascota.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record MascotaRequest(
    @NotBlank String nombre,
    LocalDate fechaNacimiento,
    String sexo,
    Double peso,
    String color,
    String notas,
    @NotNull Integer propietarioId,
    @NotNull Integer especieId,
    @NotNull Integer razaId
) {
}
