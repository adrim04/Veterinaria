package com.veterinaria.auth.controller;

import com.veterinaria.auth.dto.LoginRequest;
import com.veterinaria.auth.dto.LoginResponse;
import com.veterinaria.auth.service.AuthService;
import com.veterinaria.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthControllerImpl implements AuthController {

    private final AuthService authService;

    @Override
    public ResponseEntity<ApiResponse<LoginResponse>> login(LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login exitoso", response));
    }
}
