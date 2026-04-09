-- ============================================
-- V1__init.sql - Script inicial de Flyway
-- ============================================

CREATE TABLE IF NOT EXISTS usuario (
    id       SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS especie (
    id     SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS raza (
    id         SERIAL PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    especie_id INTEGER NOT NULL REFERENCES especie(id)
);

CREATE TABLE IF NOT EXISTS propietario (
    id        SERIAL PRIMARY KEY,
    nombre    VARCHAR(100) NOT NULL,
    apellido  VARCHAR(100) NOT NULL,
    telefono  VARCHAR(20),
    correo    VARCHAR(150),
    direccion VARCHAR(255),
    ci        VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS mascota (
    id                SERIAL PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    fecha_nacimiento  DATE,
    sexo              VARCHAR(1),
    peso              DOUBLE PRECISION,
    color             VARCHAR(80),
    notas             TEXT,
    propietario_id    INTEGER REFERENCES propietario(id),
    especie_id        INTEGER REFERENCES especie(id),
    raza_id           INTEGER REFERENCES raza(id)
);

CREATE TABLE IF NOT EXISTS visita (
    id            SERIAL PRIMARY KEY,
    fecha         TIMESTAMP NOT NULL,
    motivo        VARCHAR(255) NOT NULL,
    diagnostico   TEXT,
    tratamiento   TEXT,
    observaciones TEXT,
    peso_actual   DOUBLE PRECISION,
    veterinario   VARCHAR(150),
    mascota_id    INTEGER NOT NULL REFERENCES mascota(id)
);

-- ============================================
-- Datos iniciales (seed)
-- ============================================

-- Usuario administrador (password: admin123 en BCrypt)
INSERT INTO usuario (username, password)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- Especies
INSERT INTO especie (nombre) VALUES ('Canino');
INSERT INTO especie (nombre) VALUES ('Felino');
INSERT INTO especie (nombre) VALUES ('Ave');
INSERT INTO especie (nombre) VALUES ('Roedor');

-- Razas - Canino (especie_id = 1)
INSERT INTO raza (nombre, especie_id) VALUES ('Labrador', 1);
INSERT INTO raza (nombre, especie_id) VALUES ('Golden Retriever', 1);
INSERT INTO raza (nombre, especie_id) VALUES ('Bulldog', 1);
INSERT INTO raza (nombre, especie_id) VALUES ('Chihuahua', 1);

-- Razas - Felino (especie_id = 2)
INSERT INTO raza (nombre, especie_id) VALUES ('Siames', 2);
INSERT INTO raza (nombre, especie_id) VALUES ('Persa', 2);
INSERT INTO raza (nombre, especie_id) VALUES ('Maine Coon', 2);
INSERT INTO raza (nombre, especie_id) VALUES ('Bengala', 2);

-- Razas - Ave (especie_id = 3)
INSERT INTO raza (nombre, especie_id) VALUES ('Loro', 3);
INSERT INTO raza (nombre, especie_id) VALUES ('Canario', 3);
INSERT INTO raza (nombre, especie_id) VALUES ('Periquito', 3);

-- Razas - Roedor (especie_id = 4)
INSERT INTO raza (nombre, especie_id) VALUES ('Hamster', 4);
INSERT INTO raza (nombre, especie_id) VALUES ('Cobaya', 4);
INSERT INTO raza (nombre, especie_id) VALUES ('Chinchilla', 4);
