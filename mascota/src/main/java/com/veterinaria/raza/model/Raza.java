package com.veterinaria.raza.model;

import com.veterinaria.especie.model.Especie;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "raza")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Raza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "especie_id")
    private Especie especie;
}
