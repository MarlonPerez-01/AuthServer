DROP DATABASE AuthDB;
CREATE DATABASE AuthDB;
USE AuthDB;

-- Table: Token
CREATE TABLE Token (
    id_token int NOT NULL AUTO_INCREMENT,
    id_usuario int NOT NULL,
    token varchar(255) NOT NULL,
    CONSTRAINT Token_pk PRIMARY KEY (id_token)
);

-- Table: Codigo
CREATE TABLE Codigo (
    id_codigo int NOT NULL AUTO_INCREMENT,
    id_usuario int NOT NULL,
    codigo varchar(255) NOT NULL,
    tipo varchar(255) NOT NULL,
    fecha_creacion timestamp NOT NULL,
    fecha_expiracion timestamp NOT NULL,
    CONSTRAINT Token_pk PRIMARY KEY (id_codigo)
);

-- Table: Usuario
CREATE TABLE Usuario (
    id_usuario int NOT NULL AUTO_INCREMENT,
    nombre varchar(255) NOT NULL,
    correo varchar(255) NOT NULL,
    contrasenia varchar(255) NOT NULL,
    rol varchar(255) NOT NULL,
    google bool NULL DEFAULT 0,
    foto varchar(255) NULL,
    verificado bool NOT NULL DEFAULT 0,
    estado bool NOT NULL DEFAULT 1,
    CONSTRAINT Usuario_pk PRIMARY KEY (id_usuario)
);

-- foreign keys
-- Reference: Token_Usuario (table: Token)
ALTER TABLE Token ADD CONSTRAINT Token_Usuario FOREIGN KEY Token_Usuario (id_usuario)
    REFERENCES Usuario (id_usuario);

-- Reference: Codigo_Usuario (table: Usuario)
ALTER TABLE Codigo ADD CONSTRAINT Codigo_Usuario FOREIGN KEY Codigo_Usuario (id_usuario)
    REFERENCES Usuario (id_usuario);
