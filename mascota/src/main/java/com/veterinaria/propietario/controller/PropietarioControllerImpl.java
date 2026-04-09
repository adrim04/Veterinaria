package com.veterinaria.propietario.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.propietario.dto.PropietarioRequest;
import com.veterinaria.propietario.dto.PropietarioResponse;
import com.veterinaria.propietario.service.PropietarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PropietarioControllerImpl implements PropietarioController {

    private final PropietarioService propietarioService;

    @Override
    public ResponseEntity<ApiResponse<List<PropietarioResponse>>> findAll() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Listado de propietarios", propietarioService.findAll()));
    }

    @Override
    public ResponseEntity<ApiResponse<PropietarioResponse>> findById(Integer id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Propietario encontrado", propietarioService.findById(id)));
    }

    @Override
    public ResponseEntity<ApiResponse<List<PropietarioResponse>>> search(String nombre, String ci) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Resultados de busqueda", propietarioService.search(nombre, ci)));
    }

    @Override
    public ResponseEntity<ApiResponse<PropietarioResponse>> create(PropietarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, "Propietario creado", propietarioService.create(request)));
    }

    @Override
    public ResponseEntity<ApiResponse<PropietarioResponse>> update(Integer id, PropietarioRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Propietario actualizado", propietarioService.update(id, request)));
    }

    @Override
    public ResponseEntity<ApiResponse<Void>> delete(Integer id) {
        propietarioService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Propietario eliminado", null));
    }
}
