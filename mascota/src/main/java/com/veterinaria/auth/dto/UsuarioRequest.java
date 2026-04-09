package com.veterinaria.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
    @NotBlank(message = "El nombre de usuario es requerido")
    String username,

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 4, message = "La contraseña debe tener al menos 4 caracteres")
    String password
) {}
