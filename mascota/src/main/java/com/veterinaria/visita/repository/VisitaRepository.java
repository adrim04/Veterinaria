package com.veterinaria.visita.repository;

import com.veterinaria.visita.model.Visita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitaRepository extends JpaRepository<Visita, Integer> {

    List<Visita> findByMascotaIdOrderByFechaDesc(Integer mascotaId);

    @Query("SELECT COUNT(v) FROM Visita v WHERE v.fecha >= :inicio AND v.fecha < :fin")
    long countByFechaBetween(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}
