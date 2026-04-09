package com.veterinaria.auth.service;

import com.veterinaria.auth.dto.LoginRequest;
import com.veterinaria.auth.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
