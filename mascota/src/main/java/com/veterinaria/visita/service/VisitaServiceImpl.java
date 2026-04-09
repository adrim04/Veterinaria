package com.veterinaria.visita.service;

import com.veterinaria.common.exception.ResourceNotFoundException;
import com.veterinaria.mascota.repository.MascotaRepository;
import com.veterinaria.visita.dto.VisitaRequest;
import com.veterinaria.visita.dto.VisitaResponse;
import com.veterinaria.visita.model.Visita;
import com.veterinaria.visita.repository.VisitaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisitaServiceImpl implements VisitaService {

    private final VisitaRepository visitaRepository;
    private final MascotaRepository mascotaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<VisitaResponse> findAll() {
        return visitaRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public VisitaResponse findById(Integer id) {
        Visita visita = visitaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Visita no encontrada con id: " + id));
        return toResponse(visita);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitaResponse> findByMascota(Integer mascotaId) {
        return visitaRepository.findByMascotaIdOrderByFechaDesc(mascotaId).stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public VisitaResponse create(VisitaRequest request) {
        var mascota = mascotaRepository.findById(request.mascotaId())
            .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada con id: " + request.mascotaId()));

        Visita visita = new Visita();
        visita.setFecha(request.fecha() != null ? request.fecha() : LocalDateTime.now());
        visita.setMotivo(request.motivo());
        visita.setDiagnostico(request.diagnostico());
        visita.setTratamiento(request.tratamiento());
        visita.setObservaciones(request.observaciones());
        visita.setPesoActual(request.pesoActual());
        visita.setVeterinario(request.veterinario());
        visita.setMascota(mascota);

        visita = visitaRepository.save(visita);
        log.info("Visita creada con id: {}", visita.getId());
        return toResponse(visita);
    }

    @Override
    @Transactional
    public VisitaResponse update(Integer id, VisitaRequest request) {
        Visita visita = visitaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Visita no encontrada con id: " + id));

        var mascota = mascotaRepository.findById(request.mascotaId())
            .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada con id: " + request.mascotaId()));

        visita.setFecha(request.fecha() != null ? request.fecha() : visita.getFecha());
        visita.setMotivo(request.motivo());
        visita.setDiagnostico(request.diagnostico());
        visita.setTratamiento(request.tratamiento());
        visita.setObservaciones(request.observaciones());
        visita.setPesoActual(request.pesoActual());
        visita.setVeterinario(request.veterinario());
        visita.setMascota(mascota);

        visita = visitaRepository.save(visita);
        log.info("Visita actualizada con id: {}", visita.getId());
        return toResponse(visita);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!visitaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Visita no encontrada con id: " + id);
        }
        visitaRepository.deleteById(id);
        log.info("Visita eliminada con id: {}", id);
    }

    private VisitaResponse toResponse(Visita v) {
        return new VisitaResponse(
            v.getId(), v.getFecha(), v.getMotivo(),
            v.getDiagnostico(), v.getTratamiento(), v.getObservaciones(),
            v.getPesoActual(), v.getVeterinario(),
            v.getMascota().getId(), v.getMascota().getNombre()
        );
    }
}
