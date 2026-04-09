package com.veterinaria.dashboard.controller;

import com.veterinaria.common.response.ApiResponse;
import com.veterinaria.dashboard.dto.DashboardEstadisticasResponse;
import com.veterinaria.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardControllerImpl implements DashboardController {

    private final DashboardService dashboardService;

    @Override
    public ResponseEntity<ApiResponse<DashboardEstadisticasResponse>> getEstadisticas() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Estadisticas del dashboard",
            dashboardService.getEstadisticas()));
    }
}
