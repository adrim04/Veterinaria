package com.veterinaria.mascota.dto;

import com.veterinaria.especie.dto.EspecieResponse;
import com.veterinaria.propietario.dto.PropietarioResponse;
import com.veterinaria.raza.dto.RazaResponse;

import java.time.LocalDate;

public record MascotaResponse(
    Integer id,
    String nombre,
    LocalDate fechaNacimiento,
    String sexo,
    Double peso,
    String color,
    String notas,
    PropietarioResponse propietario,
    EspecieResponse especie,
    RazaResponse raza
) {
}
