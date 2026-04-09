package com.veterinaria.raza.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.raza.dto.RazaRequest;
import com.veterinaria.raza.dto.RazaResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Razas", description = "Gestion de razas")
@RequestMapping("/api/v1/razas")
public interface RazaController {

    @Operation(summary = "Listar todas las razas")
    @GetMapping
    ResponseEntity<ApiResponse<List<RazaResponse>>> findAll(
        @RequestParam(required = false) Integer especieId);

    @Operation(summary = "Crear una raza")
    @PostMapping
    ResponseEntity<ApiResponse<RazaResponse>> create(@Valid @RequestBody RazaRequest request);
}
