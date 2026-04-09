package com.veterinaria.auth.controller;

import com.veterinaria.auth.dto.LoginRequest;
import com.veterinaria.auth.dto.LoginResponse;
import com.veterinaria.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = "Auth", description = "Autenticacion de usuarios")
@RequestMapping("/api/v1/auth")
public interface AuthController {

    @Operation(summary = "Login de usuario")
    @PostMapping("/login")
    ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request);
}
