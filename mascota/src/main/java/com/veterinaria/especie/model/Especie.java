package com.veterinaria.especie.model;

import com.veterinaria.raza.model.Raza;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "especie")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Especie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @OneToMany(mappedBy = "especie", fetch = FetchType.LAZY)
    private List<Raza> razas;
}
