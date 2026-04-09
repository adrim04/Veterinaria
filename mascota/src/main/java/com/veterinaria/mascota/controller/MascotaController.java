package com.veterinaria.mascota.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.mascota.dto.MascotaRequest;
import com.veterinaria.mascota.dto.MascotaResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Mascotas", description = "Gestion de mascotas")
@RequestMapping("/api/v1/mascotas")
public interface MascotaController {

    @Operation(summary = "Listar todas las mascotas")
    @GetMapping
    ResponseEntity<ApiResponse<List<MascotaResponse>>> findAll();

    @Operation(summary = "Obtener mascota por ID")
    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<MascotaResponse>> findById(@PathVariable Integer id);

    @Operation(summary = "Buscar mascotas por nombre o propietario")
    @GetMapping("/buscar")
    ResponseEntity<ApiResponse<List<MascotaResponse>>> search(
        @RequestParam(required = false) String nombre,
        @RequestParam(required = false) Integer propietarioId);

    @Operation(summary = "Crear una mascota")
    @PostMapping
    ResponseEntity<ApiResponse<MascotaResponse>> create(@Valid @RequestBody MascotaRequest request);

    @Operation(summary = "Actualizar una mascota")
    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<MascotaResponse>> update(
        @PathVariable Integer id,
        @Valid @RequestBody MascotaRequest request);

    @Operation(summary = "Eliminar una mascota")
    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id);
}
