package com.veterinaria.auth.service;

import com.veterinaria.auth.dto.LoginRequest;
import com.veterinaria.auth.dto.LoginResponse;
import com.veterinaria.auth.repository.UsuarioRepository;
import com.veterinaria.auth.util.JwtUtil;
import com.veterinaria.common.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        var usuario = usuarioRepository.findByUsername(request.username())
            .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new BadRequestException("Credenciales invalidas");
        }

        String token = jwtUtil.generateToken(usuario.getUsername());
        log.info("Usuario '{}' autenticado exitosamente", usuario.getUsername());

        return new LoginResponse(token, "Bearer", usuario.getUsername());
    }
}
