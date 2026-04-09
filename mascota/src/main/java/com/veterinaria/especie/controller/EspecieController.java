package com.veterinaria.especie.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.especie.dto.EspecieRequest;
import com.veterinaria.especie.dto.EspecieResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Especies", description = "Gestion de especies")
@RequestMapping("/api/v1/especies")
public interface EspecieController {

    @Operation(summary = "Listar todas las especies con sus razas")
    @GetMapping
    ResponseEntity<ApiResponse<List<EspecieResponse>>> findAll();

    @Operation(summary = "Crear una especie")
    @PostMapping
    ResponseEntity<ApiResponse<EspecieResponse>> create(@Valid @RequestBody EspecieRequest request);
}
