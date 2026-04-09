package com.veterinaria.mascota.service;

import com.veterinaria.mascota.dto.MascotaRequest;
import com.veterinaria.mascota.dto.MascotaResponse;

import java.util.List;

public interface MascotaService {

    List<MascotaResponse> findAll();

    MascotaResponse findById(Integer id);

    List<MascotaResponse> search(String nombre, Integer propietarioId);

    MascotaResponse create(MascotaRequest request);

    MascotaResponse update(Integer id, MascotaRequest request);

    void delete(Integer id);
}
