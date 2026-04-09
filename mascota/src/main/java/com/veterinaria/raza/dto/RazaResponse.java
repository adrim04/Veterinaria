package com.veterinaria.raza.dto;

public record RazaResponse(
    Integer id,
    String nombre,
    Integer especieId,
    String especieNombre
) {
}
