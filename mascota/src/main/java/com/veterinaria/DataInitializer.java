package com.veterinaria;

import com.veterinaria.auth.model.Usuario;
import com.veterinaria.auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        usuarioRepository.findByUsername("admin").ifPresentOrElse(
            admin -> {
                admin.setPassword(passwordEncoder.encode("1234"));
                usuarioRepository.save(admin);
                log.info("Contrasena del usuario admin actualizada");
            },
            () -> {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("1234"));
                usuarioRepository.save(admin);
                log.info("Usuario admin creado con contrasena por defecto");
            }
        );
    }
}
