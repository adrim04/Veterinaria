package com.veterinaria.visita.service;

import com.veterinaria.visita.dto.VisitaRequest;
import com.veterinaria.visita.dto.VisitaResponse;

import java.util.List;

public interface VisitaService {

    List<VisitaResponse> findAll();

    VisitaResponse findById(Integer id);

    List<VisitaResponse> findByMascota(Integer mascotaId);

    VisitaResponse create(VisitaRequest request);

    VisitaResponse update(Integer id, VisitaRequest request);

    void delete(Integer id);
}
