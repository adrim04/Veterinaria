package com.veterinaria.propietario.repository;

import com.veterinaria.propietario.model.Propietario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropietarioRepository extends JpaRepository<Propietario, Integer> {

    @Query("SELECT p FROM Propietario p WHERE " +
           "(:nombre IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) " +
           "OR LOWER(p.apellido) LIKE LOWER(CONCAT('%', :nombre, '%'))) " +
           "AND (:ci IS NULL OR p.ci = :ci)")
    List<Propietario> search(@Param("nombre") String nombre, @Param("ci") String ci);
}
