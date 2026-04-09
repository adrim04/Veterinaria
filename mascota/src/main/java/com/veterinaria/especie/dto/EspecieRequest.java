package com.veterinaria.especie.dto;

import jakarta.validation.constraints.NotBlank;

public record EspecieRequest(
    @NotBlank String nombre
) {
}
