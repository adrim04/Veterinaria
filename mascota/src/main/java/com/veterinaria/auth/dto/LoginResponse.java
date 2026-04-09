package com.veterinaria.auth.dto;

public record LoginResponse(
    String token,
    String tipo,
    String username
) {
}
