package com.veterinaria.raza.service;

import com.veterinaria.raza.dto.RazaRequest;
import com.veterinaria.raza.dto.RazaResponse;

import java.util.List;

public interface RazaService {

    List<RazaResponse> findAll();

    List<RazaResponse> findByEspecie(Integer especieId);

    RazaResponse create(RazaRequest request);
}
