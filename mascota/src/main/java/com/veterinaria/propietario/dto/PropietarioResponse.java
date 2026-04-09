package com.veterinaria.propietario.dto;

public record PropietarioResponse(
    Integer id,
    String nombre,
    String apellido,
    String telefono,
    String correo,
    String direccion,
    String ci
) {
}
