package com.veterinaria.auth.controller;

import com.veterinaria.auth.dto.UsuarioRequest;
import com.veterinaria.auth.dto.UsuarioResponse;
import com.veterinaria.auth.model.Usuario;
import com.veterinaria.auth.repository.UsuarioRepository;
import com.veterinaria.common.exception.BadRequestException;
import com.veterinaria.common.exception.ResourceNotFoundException;
import com.veterinaria.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UsuarioControllerImpl implements UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<UsuarioResponse>>> findAll() {
        List<UsuarioResponse> usuarios = usuarioRepository.findAll().stream()
            .map(u -> new UsuarioResponse(u.getId(), u.getUsername()))
            .toList();
        return ResponseEntity.ok(new ApiResponse<>(true, "Usuarios obtenidos", usuarios));
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<UsuarioResponse>> create(@Valid UsuarioRequest request) {
        if (usuarioRepository.findByUsername(request.username()).isPresent()) {
            throw new BadRequestException("Ya existe un usuario con el nombre: " + request.username());
        }
        Usuario usuario = new Usuario();
        usuario.setUsername(request.username());
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario = usuarioRepository.save(usuario);
        log.info("Usuario creado: {}", usuario.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "Usuario creado exitosamente",
                new UsuarioResponse(usuario.getId(), usuario.getUsername())));
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Void>> delete(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        if ("admin".equals(usuario.getUsername())) {
            throw new BadRequestException("No se puede eliminar el usuario administrador");
        }
        usuarioRepository.deleteById(id);
        log.info("Usuario eliminado: {}", usuario.getUsername());
        return ResponseEntity.ok(new ApiResponse<>(true, "Usuario eliminado", null));
    }
}
