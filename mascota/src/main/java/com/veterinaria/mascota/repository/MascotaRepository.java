package com.veterinaria.mascota.repository;

import com.veterinaria.mascota.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Integer> {

    @Query("SELECT m FROM Mascota m WHERE " +
           "(:nombre IS NULL OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) " +
           "AND (:propietarioId IS NULL OR m.propietario.id = :propietarioId)")
    List<Mascota> search(@Param("nombre") String nombre, @Param("propietarioId") Integer propietarioId);

    @Query("SELECT m.especie.nombre, COUNT(m) FROM Mascota m GROUP BY m.especie.nombre")
    List<Object[]> countByEspecie();
}

