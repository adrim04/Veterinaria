package com.veterinaria.mascota.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.mascota.dto.MascotaRequest;
import com.veterinaria.mascota.dto.MascotaResponse;
import com.veterinaria.mascota.service.MascotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MascotaControllerImpl implements MascotaController {

    private final MascotaService mascotaService;

    @Override
    public ResponseEntity<ApiResponse<List<MascotaResponse>>> findAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Listado de mascotas", mascotaService.findAll()));
    }

    @Override
    public ResponseEntity<ApiResponse<MascotaResponse>> findById(Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Mascota encontrada", mascotaService.findById(id)));
    }

    @Override
    public ResponseEntity<ApiResponse<List<MascotaResponse>>> search(String nombre, Integer propietarioId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Resultados de busqueda", mascotaService.search(nombre, propietarioId)));
    }

    @Override
    public ResponseEntity<ApiResponse<MascotaResponse>> create(MascotaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "Mascota creada", mascotaService.create(request)));
    }

    @Override
    public ResponseEntity<ApiResponse<MascotaResponse>> update(Integer id, MascotaRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Mascota actualizada", mascotaService.update(id, request)));
    }

    @Override
    public ResponseEntity<ApiResponse<Void>> delete(Integer id) {
        mascotaService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Mascota eliminada", null));
    }
}
