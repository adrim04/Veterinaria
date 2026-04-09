package com.veterinaria.mascota.service;

import com.veterinaria.common.exception.BadRequestException;
import com.veterinaria.common.exception.ResourceNotFoundException;
import com.veterinaria.especie.dto.EspecieResponse;
import com.veterinaria.especie.model.Especie;
import com.veterinaria.especie.repository.EspecieRepository;
import com.veterinaria.mascota.dto.MascotaRequest;
import com.veterinaria.mascota.dto.MascotaResponse;
import com.veterinaria.mascota.model.Mascota;
import com.veterinaria.mascota.repository.MascotaRepository;
import com.veterinaria.propietario.dto.PropietarioResponse;
import com.veterinaria.propietario.model.Propietario;
import com.veterinaria.propietario.repository.PropietarioRepository;
import com.veterinaria.raza.dto.RazaResponse;
import com.veterinaria.raza.model.Raza;
import com.veterinaria.raza.repository.RazaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MascotaServiceImpl implements MascotaService {

    private final MascotaRepository mascotaRepository;
    private final PropietarioRepository propietarioRepository;
    private final EspecieRepository especieRepository;
    private final RazaRepository razaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MascotaResponse> findAll() {
        return mascotaRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MascotaResponse findById(Integer id) {
        Mascota mascota = mascotaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada con id: " + id));
        return toResponse(mascota);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MascotaResponse> search(String nombre, Integer propietarioId) {
        return mascotaRepository.search(nombre, propietarioId).stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public MascotaResponse create(MascotaRequest request) {
        Propietario propietario = propietarioRepository.findById(request.propietarioId())
            .orElseThrow(() -> new ResourceNotFoundException("Propietario no encontrado con id: " + request.propietarioId()));
        Especie especie = especieRepository.findById(request.especieId())
            .orElseThrow(() -> new ResourceNotFoundException("Especie no encontrada con id: " + request.especieId()));
        Raza raza = razaRepository.findById(request.razaId())
            .orElseThrow(() -> new ResourceNotFoundException("Raza no encontrada con id: " + request.razaId()));

        if (!raza.getEspecie().getId().equals(especie.getId())) {
            throw new BadRequestException("La raza no pertenece a la especie indicada");
        }

        Mascota mascota = new Mascota();
        mapRequestToEntity(request, mascota, propietario, especie, raza);
        mascota = mascotaRepository.save(mascota);
        log.info("Mascota creada con id: {}", mascota.getId());
        return toResponse(mascota);
    }

    @Override
    @Transactional
    public MascotaResponse update(Integer id, MascotaRequest request) {
        Mascota mascota = mascotaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada con id: " + id));

        Propietario propietario = propietarioRepository.findById(request.propietarioId())
            .orElseThrow(() -> new ResourceNotFoundException("Propietario no encontrado con id: " + request.propietarioId()));
        Especie especie = especieRepository.findById(request.especieId())
            .orElseThrow(() -> new ResourceNotFoundException("Especie no encontrada con id: " + request.especieId()));
        Raza raza = razaRepository.findById(request.razaId())
            .orElseThrow(() -> new ResourceNotFoundException("Raza no encontrada con id: " + request.razaId()));

        if (!raza.getEspecie().getId().equals(especie.getId())) {
            throw new BadRequestException("La raza no pertenece a la especie indicada");
        }

        mapRequestToEntity(request, mascota, propietario, especie, raza);
        mascota = mascotaRepository.save(mascota);
        log.info("Mascota actualizada con id: {}", mascota.getId());
        return toResponse(mascota);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!mascotaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mascota no encontrada con id: " + id);
        }
        mascotaRepository.deleteById(id);
        log.info("Mascota eliminada con id: {}", id);
    }

    private MascotaResponse toResponse(Mascota m) {
        PropietarioResponse propResp = new PropietarioResponse(
            m.getPropietario().getId(), m.getPropietario().getNombre(),
            m.getPropietario().getApellido(), m.getPropietario().getTelefono(),
            m.getPropietario().getCorreo(), m.getPropietario().getDireccion(),
            m.getPropietario().getCi()
        );

        EspecieResponse espResp = new EspecieResponse(
            m.getEspecie().getId(), m.getEspecie().getNombre(), Collections.emptyList()
        );

        RazaResponse razaResp = new RazaResponse(
            m.getRaza().getId(), m.getRaza().getNombre(),
            m.getRaza().getEspecie().getId(), m.getRaza().getEspecie().getNombre()
        );

        return new MascotaResponse(
            m.getId(), m.getNombre(), m.getFechaNacimiento(),
            m.getSexo(), m.getPeso(), m.getColor(), m.getNotas(),
            propResp, espResp, razaResp
        );
    }

    private void mapRequestToEntity(MascotaRequest request, Mascota mascota,
                                     Propietario propietario, Especie especie, Raza raza) {
        mascota.setNombre(request.nombre());
        mascota.setFechaNacimiento(request.fechaNacimiento());
        mascota.setSexo(request.sexo());
        mascota.setPeso(request.peso());
        mascota.setColor(request.color());
        mascota.setNotas(request.notas());
        mascota.setPropietario(propietario);
        mascota.setEspecie(especie);
        mascota.setRaza(raza);
    }
}
