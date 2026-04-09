package com.veterinaria.propietario.service;

import com.veterinaria.propietario.dto.PropietarioRequest;
import com.veterinaria.propietario.dto.PropietarioResponse;

import java.util.List;

public interface PropietarioService {

    List<PropietarioResponse> findAll();

    PropietarioResponse findById(Integer id);

    List<PropietarioResponse> search(String nombre, String ci);

    PropietarioResponse create(PropietarioRequest request);

    PropietarioResponse update(Integer id, PropietarioRequest request);

    void delete(Integer id);
}
