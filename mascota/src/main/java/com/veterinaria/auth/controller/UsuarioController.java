package com.veterinaria.auth.controller;

import com.veterinaria.auth.dto.UsuarioRequest;
import com.veterinaria.auth.dto.UsuarioResponse;
import com.veterinaria.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema")
@RequestMapping("/api/v1/usuarios")
public interface UsuarioController {

    @Operation(summary = "Listar todos los usuarios")
    @GetMapping
    ResponseEntity<ApiResponse<List<UsuarioResponse>>> findAll();

    @Operation(summary = "Crear un nuevo usuario")
    @PostMapping
    ResponseEntity<ApiResponse<UsuarioResponse>> create(@Valid @RequestBody UsuarioRequest request);

    @Operation(summary = "Eliminar un usuario")
    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id);
}
