package com.veterinaria.raza.service;

import com.veterinaria.common.exception.ResourceNotFoundException;
import com.veterinaria.especie.repository.EspecieRepository;
import com.veterinaria.raza.dto.RazaRequest;
import com.veterinaria.raza.dto.RazaResponse;
import com.veterinaria.raza.model.Raza;
import com.veterinaria.raza.repository.RazaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazaServiceImpl implements RazaService {

    private final RazaRepository razaRepository;
    private final EspecieRepository especieRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RazaResponse> findAll() {
        return razaRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RazaResponse> findByEspecie(Integer especieId) {
        return razaRepository.findByEspecieId(especieId).stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public RazaResponse create(RazaRequest request) {
        var especie = especieRepository.findById(request.especieId())
            .orElseThrow(() -> new ResourceNotFoundException("Especie no encontrada con id: " + request.especieId()));

        Raza raza = new Raza();
        raza.setNombre(request.nombre());
        raza.setEspecie(especie);
        raza = razaRepository.save(raza);
        log.info("Raza creada con id: {}", raza.getId());
        return toResponse(raza);
    }

    private RazaResponse toResponse(Raza r) {
        return new RazaResponse(
            r.getId(), r.getNombre(),
            r.getEspecie().getId(), r.getEspecie().getNombre()
        );
    }
}
