package com.veterinaria.propietario.dto;

import jakarta.validation.constraints.NotBlank;

public record PropietarioRequest(
    @NotBlank String nombre,
    @NotBlank String apellido,
    String telefono,
    String correo,
    String direccion,
    String ci
) {
}
