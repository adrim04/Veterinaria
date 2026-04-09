package com.veterinaria.visita.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.visita.dto.VisitaRequest;
import com.veterinaria.visita.dto.VisitaResponse;
import com.veterinaria.visita.service.VisitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class VisitaControllerImpl implements VisitaController {

    private final VisitaService visitaService;

    @Override
    public ResponseEntity<ApiResponse<List<VisitaResponse>>> findAll(Integer mascotaId) {
        List<VisitaResponse> visitas = mascotaId != null
            ? visitaService.findByMascota(mascotaId)
            : visitaService.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Listado de visitas", visitas));
    }

    @Override
    public ResponseEntity<ApiResponse<VisitaResponse>> findById(Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Visita encontrada", visitaService.findById(id)));
    }

    @Override
    public ResponseEntity<ApiResponse<VisitaResponse>> create(VisitaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "Visita creada", visitaService.create(request)));
    }

    @Override
    public ResponseEntity<ApiResponse<VisitaResponse>> update(Integer id, VisitaRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Visita actualizada", visitaService.update(id, request)));
    }

    @Override
    public ResponseEntity<ApiResponse<Void>> delete(Integer id) {
        visitaService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Visita eliminada", null));
    }
}
