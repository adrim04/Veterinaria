package com.veterinaria.visita.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.visita.dto.VisitaRequest;
import com.veterinaria.visita.dto.VisitaResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Visitas", description = "Gestion de visitas medicas")
@RequestMapping("/api/v1/visitas")
public interface VisitaController {

    @Operation(summary = "Listar todas las visitas")
    @GetMapping
    ResponseEntity<ApiResponse<List<VisitaResponse>>> findAll(
        @RequestParam(required = false) Integer mascotaId);

    @Operation(summary = "Obtener visita por ID")
    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<VisitaResponse>> findById(@PathVariable Integer id);

    @Operation(summary = "Crear una visita")
    @PostMapping
    ResponseEntity<ApiResponse<VisitaResponse>> create(@Valid @RequestBody VisitaRequest request);

    @Operation(summary = "Actualizar una visita")
    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<VisitaResponse>> update(
        @PathVariable Integer id,
        @Valid @RequestBody VisitaRequest request);

    @Operation(summary = "Eliminar una visita")
    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id);
}
