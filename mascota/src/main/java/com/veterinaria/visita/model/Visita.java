package com.veterinaria.visita.model;

import com.veterinaria.mascota.model.Mascota;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "visita")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Visita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private String motivo;

    private String diagnostico;

    private String tratamiento;

    private String observaciones;

    @Column(name = "peso_actual")
    private Double pesoActual;

    private String veterinario;

    @ManyToOne
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;
}
