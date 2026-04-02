-- =========================================================================
-- BASE DE DATOS: League of sports
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------------------
-- 1. TABLAS BASE (Roles y Usuarios)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `nombre_rol` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `id_rol` INT NOT NULL DEFAULT '1',
  `nickname` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `elo` ENUM('Unranked','Hierro','Bronce','Plata','Oro','Platino','Esmeralda','Diamante','Master','Gran Master','Challenger') NOT NULL DEFAULT 'Unranked',
  `puntos_totales` INT NOT NULL DEFAULT '0',
  `estado` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_registro` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nickname` (`nickname`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -------------------------------------------------------------------------
-- 2. GESTIÓN DE EQUIPOS
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `equipos`;
CREATE TABLE `equipos` (
  `id_equipo` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `logo_url` VARCHAR(255) DEFAULT NULL,
  `estado` ENUM('activo', 'disuelto') NOT NULL DEFAULT 'activo',
  `fecha_creacion` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_equipo`),
  UNIQUE KEY `nombre_equipo` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `equipo_miembros`;
CREATE TABLE `equipo_miembros` (
  `id_equipo` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `rol_en_equipo` ENUM('Capitan', 'Titular', 'Suplente') NOT NULL DEFAULT 'Titular',
  `fecha_ingreso` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_equipo`, `id_usuario`),
  CONSTRAINT `fk_equipo_miembro` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE,
  CONSTRAINT `fk_usuario_miembro` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -------------------------------------------------------------------------
-- 3. GESTIÓN DE TORNEOS
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `torneos`;
CREATE TABLE `torneos` (
  `id_torneo` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `modalidad` ENUM('1v1','2v2','3v3','4v4','5v5') NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `estado` ENUM('pendiente','en_curso','finalizado') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id_torneo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `torneo_equipos`;
CREATE TABLE `torneo_equipos` (
  `id_torneo_equipo` INT NOT NULL AUTO_INCREMENT,
  `id_torneo` INT NOT NULL,
  `id_equipo` INT NOT NULL,
  `estado_inscripcion` ENUM('registrado', 'descalificado', 'campeon') NOT NULL DEFAULT 'registrado',
  `fecha_registro` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_torneo_equipo`),
  UNIQUE KEY `unico_equipo_torneo` (`id_torneo`, `id_equipo`),
  CONSTRAINT `fk_te_torneo` FOREIGN KEY (`id_torneo`) REFERENCES `torneos` (`id_torneo`) ON DELETE CASCADE,
  CONSTRAINT `fk_te_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -------------------------------------------------------------------------
-- 4. PARTIDAS Y ESTADÍSTICAS (Motor del Salón de la Fama)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `partidas`;
CREATE TABLE `partidas` (
  `id_partida` INT NOT NULL AUTO_INCREMENT,
  `id_torneo` INT NOT NULL,
  `id_equipo_azul` INT NOT NULL,
  `id_equipo_rojo` INT NOT NULL,
  `id_equipo_ganador` INT DEFAULT NULL,
  `duracion_minutos` INT DEFAULT NULL,
  `fecha_partida` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_partida`),
  CONSTRAINT `fk_partida_torneo` FOREIGN KEY (`id_torneo`) REFERENCES `torneos` (`id_torneo`) ON DELETE CASCADE,
  CONSTRAINT `fk_equipo_azul` FOREIGN KEY (`id_equipo_azul`) REFERENCES `equipos` (`id_equipo`) ON DELETE RESTRICT,
  CONSTRAINT `fk_equipo_rojo` FOREIGN KEY (`id_equipo_rojo`) REFERENCES `equipos` (`id_equipo`) ON DELETE RESTRICT,
  CONSTRAINT `fk_equipo_ganador` FOREIGN KEY (`id_equipo_ganador`) REFERENCES `equipos` (`id_equipo`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `estadisticas_partida`;
CREATE TABLE `estadisticas_partida` (
  `id_estadistica` INT NOT NULL AUTO_INCREMENT,
  `id_partida` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `campeon_jugado` VARCHAR(50) NOT NULL,
  `kills` INT DEFAULT 0,
  `deaths` INT DEFAULT 0,
  `assists` INT DEFAULT 0,
  `minions_asesinados` INT DEFAULT 0,
  `oro_total` INT DEFAULT 0,
  `vision_score` INT DEFAULT 0,
  PRIMARY KEY (`id_estadistica`),
  UNIQUE KEY `unico_usuario_partida` (`id_partida`, `id_usuario`),
  CONSTRAINT `fk_stat_partida` FOREIGN KEY (`id_partida`) REFERENCES `partidas` (`id_partida`) ON DELETE CASCADE,
  CONSTRAINT `fk_stat_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -------------------------------------------------------------------------
-- 5. RECOMPENSAS E HISTORIAL DE PUNTOS
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `recompensas`;
CREATE TABLE `recompensas` (
  `id_recompensa` INT NOT NULL AUTO_INCREMENT,
  `nombre_recompensa` VARCHAR(100) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `costo_puntos` INT NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_recompensa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `historial_puntos`;
CREATE TABLE `historial_puntos` (
  `id_historial` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `tipo_movimiento` ENUM('ingreso', 'egreso') NOT NULL,
  `cantidad_puntos` INT NOT NULL,
  `motivo` VARCHAR(255) NOT NULL,
  `id_referencia` INT DEFAULT NULL,
  `fecha_movimiento` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  CONSTRAINT `fk_historial_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


SET FOREIGN_KEY_CHECKS = 1;


-- Inserción de Roles (Es necesario hacerlo antes que los usuarios)
INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES 
(1, 'user'),
(2, 'admin'),
(3, 'superadmin');

-- Inserción de Usuarios 
INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `nickname`, `password`, `elo`, `puntos_totales`, `estado`, `fecha_registro`) VALUES 
(19,3,'nunupro','$2y$10$oSY8WK2w2/eldYCK2BvbwOTYXw.1VIIB0fo8cxaK4jumXasn8.Z.K','Diamante',0,'activo','2026-04-02 04:39:05'),
(20,3,'zeros','$2y$10$Hx5qU2hEbGwkqgvUIupcB.vM56PjXps8Qea4XdBvrvRdqOmtbc9aC','Platino',0,'activo','2026-04-02 04:39:05'),
(21,1,'josue','$2y$10$5p49HsVDC/Yh.L/WGONFIenFPurHhhpXp6gVLz/MaYHRvus5APZmu','Diamante',0,'activo','2026-04-02 04:39:05'),
(22,1,'chakito','$2y$10$3w.U82p0l1PrD4FfOmgnEOtqgbNy6tPL7pg4ow8lsbCxr0KZmjvPG','Oro',0,'activo','2026-04-02 04:39:05'),
(23,1,'jhoncitopro','$2y$10$WxsCziPFkOSYxNg8tW.FAuNLByozm.wwVgwBCEVBAdDL11dYYYiwe','Platino',0,'activo','2026-04-02 04:39:05'),
(24,1,'jhair','$2y$10$.j.lLGPWLrWCphHeIXBjruguptrjXLVahXb.M9U4tXLvVkwjQiQsy','Diamante',0,'activo','2026-04-02 04:39:05'),
(25,1,'willy','$2y$10$5KHkzq42oIq7q5XIrmd9a.RaOVlRIVZEj3oAs7qeg6INkfCc8FGaW','Platino',0,'activo','2026-04-02 04:39:05'),
(26,1,'jandro','$2y$10$sZpbmpeFw5/JBsOqAb.wYOT/YctdxNKoVyD.BV/QFVEx4XyX95FQS','Oro',0,'activo','2026-04-02 04:39:05'),
(27,1,'evans','$2y$10$hGsSNBZgyslOz0yap86ccuXHED8jb/zo7Tq4ySobXjy8jy84n/Cr6','Esmeralda',0,'activo','2026-04-02 04:39:05'),
(28,1,'kohai','$2y$10$JXHwf01tXQ3MczNqN82sX.x3ladjBHHisoifW/IkXbVdXxZUhf0ay','Oro',0,'activo','2026-04-02 04:39:05'),
(29,1,'poro','$2y$10$OltCx72PcRaM37QqpbSXg.PMBveKCpyFDEG3Fa.DWIyZeQoHO0b9q','Diamante',0,'activo','2026-04-02 04:39:05'),
(30,1,'juan','$2y$10$D9Ud9xz/jD4Nr3At.6AmPuWNtMv2HfvAETmzqjjUpQ4nl0hviJc0C','Oro',0,'activo','2026-04-02 04:39:05'),
(31,1,'jhosep','$2y$10$YWfux77ItujyQXzu7KlsqeNwkKBSkQ5NQAoueFpp7fQCzjDEO3YKu','Unranked',0,'activo','2026-04-02 04:39:05'),
(32,1,'triple A','$2y$10$4EcWz.TjQoUvI03/LpS0SOMcnI8Et2JqQsU3OyhTZR8ir79PHbxZC','Platino',0,'activo','2026-04-02 04:39:05');