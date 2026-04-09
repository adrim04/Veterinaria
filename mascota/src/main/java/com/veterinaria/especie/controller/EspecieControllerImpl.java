package com.veterinaria.especie.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.especie.dto.EspecieRequest;
import com.veterinaria.especie.dto.EspecieResponse;
import com.veterinaria.especie.service.EspecieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EspecieControllerImpl implements EspecieController {

    private final EspecieService especieService;

    @Override
    public ResponseEntity<ApiResponse<List<EspecieResponse>>> findAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Listado de especies", especieService.findAll()));
    }

    @Override
    public ResponseEntity<ApiResponse<EspecieResponse>> create(EspecieRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "Especie creada", especieService.create(request)));
    }
}
