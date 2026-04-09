package com.veterinaria.dashboard.service;

import com.veterinaria.dashboard.dto.DashboardEstadisticasResponse;
import com.veterinaria.dashboard.dto.DashboardEstadisticasResponse.EspecieConteoResponse;
import com.veterinaria.mascota.repository.MascotaRepository;
import com.veterinaria.propietario.repository.PropietarioRepository;
import com.veterinaria.visita.repository.VisitaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final MascotaRepository mascotaRepository;
    private final PropietarioRepository propietarioRepository;
    private final VisitaRepository visitaRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardEstadisticasResponse getEstadisticas() {
        long totalMascotas = mascotaRepository.count();
        long totalPropietarios = propietarioRepository.count();

        LocalDate now = LocalDate.now();
        LocalDateTime inicioMes = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = now.plusMonths(1).withDayOfMonth(1).atStartOfDay();
        long visitasMesActual = visitaRepository.countByFechaBetween(inicioMes, finMes);

        List<EspecieConteoResponse> mascotasPorEspecie = mascotaRepository.countByEspecie().stream()
            .map(row -> new EspecieConteoResponse((String) row[0], (Long) row[1]))
            .toList();

        return new DashboardEstadisticasResponse(
            totalMascotas, totalPropietarios, visitasMesActual, mascotasPorEspecie
        );
    }
}
