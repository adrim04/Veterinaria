package com.veterinaria.dashboard.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.dashboard.dto.DashboardEstadisticasResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = "Dashboard", description = "Estadisticas generales")
@RequestMapping("/api/v1/dashboard")
public interface DashboardController {

    @Operation(summary = "Obtener estadisticas generales")
    @GetMapping("/estadisticas")
    ResponseEntity<ApiResponse<DashboardEstadisticasResponse>> getEstadisticas();
}
