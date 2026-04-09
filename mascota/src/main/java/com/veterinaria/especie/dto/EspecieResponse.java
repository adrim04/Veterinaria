package com.veterinaria.especie.dto;

import com.veterinaria.raza.dto.RazaResponse;

import java.util.List;

public record EspecieResponse(
    Integer id,
    String nombre,
    List<RazaResponse> razas
) {
}
