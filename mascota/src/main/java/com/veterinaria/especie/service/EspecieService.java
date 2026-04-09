package com.veterinaria.especie.service;

import com.veterinaria.especie.dto.EspecieRequest;
import com.veterinaria.especie.dto.EspecieResponse;

import java.util.List;

public interface EspecieService {

    List<EspecieResponse> findAll();

    EspecieResponse create(EspecieRequest request);
}
