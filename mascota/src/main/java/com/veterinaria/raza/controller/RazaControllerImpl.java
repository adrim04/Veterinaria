package com.veterinaria.raza.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.raza.dto.RazaRequest;
import com.veterinaria.raza.dto.RazaResponse;
import com.veterinaria.raza.service.RazaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RazaControllerImpl implements RazaController {

    private final RazaService razaService;

    @Override
    public ResponseEntity<ApiResponse<List<RazaResponse>>> findAll(Integer especieId) {
        List<RazaResponse> razas = especieId != null
            ? razaService.findByEspecie(especieId)
            : razaService.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Listado de razas", razas));
    }

    @Override
    public ResponseEntity<ApiResponse<RazaResponse>> create(RazaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "Raza creada", razaService.create(request)));
    }
}
