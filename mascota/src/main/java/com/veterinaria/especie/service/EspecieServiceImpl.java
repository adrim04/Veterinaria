package com.veterinaria.especie.service;

import com.veterinaria.especie.dto.EspecieRequest;
import com.veterinaria.especie.dto.EspecieResponse;
import com.veterinaria.especie.model.Especie;
import com.veterinaria.especie.repository.EspecieRepository;
import com.veterinaria.raza.dto.RazaResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EspecieServiceImpl implements EspecieService {

    private final EspecieRepository especieRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EspecieResponse> findAll() {
        return especieRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public EspecieResponse create(EspecieRequest request) {
        Especie especie = new Especie();
        especie.setNombre(request.nombre());
        especie = especieRepository.save(especie);
        log.info("Especie creada con id: {}", especie.getId());
        return new EspecieResponse(especie.getId(), especie.getNombre(), Collections.emptyList());
    }

    private EspecieResponse toResponse(Especie e) {
        List<RazaResponse> razas = e.getRazas() != null
            ? e.getRazas().stream()
                .map(r -> new RazaResponse(r.getId(), r.getNombre(), e.getId(), e.getNombre()))
                .toList()
            : Collections.emptyList();
        return new EspecieResponse(e.getId(), e.getNombre(), razas);
    }
}
