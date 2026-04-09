package com.veterinaria.mascota.model;

import com.veterinaria.especie.model.Especie;
import com.veterinaria.propietario.model.Propietario;
import com.veterinaria.raza.model.Raza;
import com.veterinaria.visita.model.Visita;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "mascota")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    private String sexo;

    private Double peso;

    private String color;

    private String notas;

    @ManyToOne
    @JoinColumn(name = "propietario_id")
    private Propietario propietario;

    @ManyToOne
    @JoinColumn(name = "especie_id")
    private Especie especie;

    @ManyToOne
    @JoinColumn(name = "raza_id")
    private Raza raza;

    @OneToMany(mappedBy = "mascota", fetch = FetchType.LAZY)
    private List<Visita> visitas;
}
