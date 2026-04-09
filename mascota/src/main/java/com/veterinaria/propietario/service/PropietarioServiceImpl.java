package com.veterinaria.propietario.service;

import com.veterinaria.common.exception.ResourceNotFoundException;
import com.veterinaria.propietario.dto.PropietarioRequest;
import com.veterinaria.propietario.dto.PropietarioResponse;
import com.veterinaria.propietario.model.Propietario;
import com.veterinaria.propietario.repository.PropietarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropietarioServiceImpl implements PropietarioService {

    private final PropietarioRepository propietarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PropietarioResponse> findAll() {
        return propietarioRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PropietarioResponse findById(Integer id) {
        Propietario propietario = propietarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Propietario no encontrado con id: " + id));
        return toResponse(propietario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropietarioResponse> search(String nombre, String ci) {
        return propietarioRepository.search(nombre, ci).stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public PropietarioResponse create(PropietarioRequest request) {
        Propietario propietario = new Propietario();
        mapRequestToEntity(request, propietario);
        propietario = propietarioRepository.save(propietario);
        log.info("Propietario creado con id: {}", propietario.getId());
        return toResponse(propietario);
    }

    @Override
    @Transactional
    public PropietarioResponse update(Integer id, PropietarioRequest request) {
        Propietario propietario = propietarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Propietario no encontrado con id: " + id));
        mapRequestToEntity(request, propietario);
        propietario = propietarioRepository.save(propietario);
        log.info("Propietario actualizado con id: {}", propietario.getId());
        return toResponse(propietario);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!propietarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Propietario no encontrado con id: " + id);
        }
        propietarioRepository.deleteById(id);
        log.info("Propietario eliminado con id: {}", id);
    }

    private PropietarioResponse toResponse(Propietario p) {
        return new PropietarioResponse(
            p.getId(), p.getNombre(), p.getApellido(),
            p.getTelefono(), p.getCorreo(), p.getDireccion(), p.getCi()
        );
    }

    private void mapRequestToEntity(PropietarioRequest request, Propietario propietario) {
        propietario.setNombre(request.nombre());
        propietario.setApellido(request.apellido());
        propietario.setTelefono(request.telefono());
        propietario.setCorreo(request.correo());
        propietario.setDireccion(request.direccion());
        propietario.setCi(request.ci());
    }
}
