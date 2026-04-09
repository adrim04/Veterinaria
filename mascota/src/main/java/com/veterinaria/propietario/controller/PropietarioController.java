package com.veterinaria.propietario.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.propietario.dto.PropietarioRequest;
import com.veterinaria.propietario.dto.PropietarioResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Propietarios", description = "Gestion de propietarios")
@RequestMapping("/api/v1/propietarios")
public interface PropietarioController {

    @Operation(summary = "Listar todos los propietarios")
    @GetMapping
    ResponseEntity<ApiResponse<List<PropietarioResponse>>> findAll();

    @Operation(summary = "Obtener propietario por ID")
    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<PropietarioResponse>> findById(@PathVariable Integer id);

    @Operation(summary = "Buscar propietarios por nombre o CI")
    @GetMapping("/buscar")
    ResponseEntity<ApiResponse<List<PropietarioResponse>>> search(
        @RequestParam(required = false) String nombre,
        @RequestParam(required = false) String ci);

    @Operation(summary = "Crear un propietario")
    @PostMapping
    ResponseEntity<ApiResponse<PropietarioResponse>> create(@Valid @RequestBody PropietarioRequest request);

    @Operation(summary = "Actualizar un propietario")
    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<PropietarioResponse>> update(
        @PathVariable Integer id,
        @Valid @RequestBody PropietarioRequest request);

    @Operation(summary = "Eliminar un propietario")
    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id);
}
