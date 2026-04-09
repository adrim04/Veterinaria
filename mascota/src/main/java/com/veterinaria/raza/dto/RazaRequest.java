package com.veterinaria.raza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RazaRequest(
    @NotBlank String nombre,
    @NotNull Integer especieId
) {
}
