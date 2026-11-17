-- LeagueOfSports | Migracion de MySQL a TiDB Cloud Starter (MySQL Compatible)
-- Fuente: copia SQL original suministrada por el propietario del proyecto.
-- Este archivo crea 10 tablas e importa los datos existentes en un esquema NUEVO.
-- IMPORTANTE: Ejecutar UNA SOLA VEZ en un esquema vacio; no contiene DROP TABLE.
-- Eliminados: GTID_PURGED, SQL_LOG_BIN, LOCK/UNLOCK TABLES, DISABLE/ENABLE KEYS,
-- y configuraciones de sesion mysqldump innecesarias para este proceso.
-- Se conservan columnas, indices, claves foraneas, enums, valores y AUTO_INCREMENT.

SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS `leagueofsports` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `leagueofsports`;

-- 1) Crear todas las tablas (orden de dependencias de FOREIGN KEY)

-- Tabla: equipos
CREATE TABLE `equipos` (
  `id_equipo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `estado` enum('activo','disuelto') NOT NULL DEFAULT 'activo',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_equipo`),
  UNIQUE KEY `nombre_equipo` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: recompensas
CREATE TABLE `recompensas` (
  `id_recompensa` int NOT NULL AUTO_INCREMENT,
  `nombre_recompensa` varchar(100) NOT NULL,
  `descripcion` text,
  `costo_puntos` int NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_recompensa`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: roles
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(20) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: torneos
CREATE TABLE `torneos` (
  `id_torneo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `modalidad` enum('1v1','2v2','3v3','4v4','5v5') NOT NULL,
  `fecha_inicio` date NOT NULL,
  `estado` enum('pendiente','en_curso','finalizado') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id_torneo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: partidas
CREATE TABLE `partidas` (
  `id_partida` int NOT NULL AUTO_INCREMENT,
  `id_torneo` int NOT NULL,
  `id_equipo_azul` int NOT NULL,
  `id_equipo_rojo` int NOT NULL,
  `id_equipo_ganador` int DEFAULT NULL,
  `duracion_minutos` int DEFAULT NULL,
  `fecha_partida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_partida`),
  KEY `fk_partida_torneo` (`id_torneo`),
  KEY `fk_equipo_azul` (`id_equipo_azul`),
  KEY `fk_equipo_rojo` (`id_equipo_rojo`),
  KEY `fk_equipo_ganador` (`id_equipo_ganador`),
  CONSTRAINT `fk_equipo_azul` FOREIGN KEY (`id_equipo_azul`) REFERENCES `equipos` (`id_equipo`) ON DELETE RESTRICT,
  CONSTRAINT `fk_equipo_ganador` FOREIGN KEY (`id_equipo_ganador`) REFERENCES `equipos` (`id_equipo`) ON DELETE RESTRICT,
  CONSTRAINT `fk_equipo_rojo` FOREIGN KEY (`id_equipo_rojo`) REFERENCES `equipos` (`id_equipo`) ON DELETE RESTRICT,
  CONSTRAINT `fk_partida_torneo` FOREIGN KEY (`id_torneo`) REFERENCES `torneos` (`id_torneo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: torneo_equipos
CREATE TABLE `torneo_equipos` (
  `id_torneo_equipo` int NOT NULL AUTO_INCREMENT,
  `id_torneo` int NOT NULL,
  `id_equipo` int NOT NULL,
  `estado_inscripcion` enum('registrado','descalificado','campeon') NOT NULL DEFAULT 'registrado',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_torneo_equipo`),
  UNIQUE KEY `unico_equipo_torneo` (`id_torneo`,`id_equipo`),
  KEY `fk_te_equipo` (`id_equipo`),
  CONSTRAINT `fk_te_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE,
  CONSTRAINT `fk_te_torneo` FOREIGN KEY (`id_torneo`) REFERENCES `torneos` (`id_torneo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: usuarios
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_rol` int NOT NULL DEFAULT '1',
  `nickname` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `elo` enum('Unranked','Hierro','Bronce','Plata','Oro','Platino','Esmeralda','Diamante','Master','Gran Master','Challenger') NOT NULL DEFAULT 'Unranked',
  `puntos_totales` int NOT NULL DEFAULT '0',
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nickname` (`nickname`),
  KEY `usuarios_ibfk_1` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: equipo_miembros
CREATE TABLE `equipo_miembros` (
  `id_equipo` int NOT NULL,
  `id_usuario` int NOT NULL,
  `rol_en_equipo` enum('Capitan','Titular','Suplente') NOT NULL DEFAULT 'Titular',
  `fecha_ingreso` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_equipo`,`id_usuario`),
  KEY `fk_usuario_miembro` (`id_usuario`),
  CONSTRAINT `fk_equipo_miembro` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE,
  CONSTRAINT `fk_usuario_miembro` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: estadisticas_partida
CREATE TABLE `estadisticas_partida` (
  `id_estadistica` int NOT NULL AUTO_INCREMENT,
  `id_partida` int NOT NULL,
  `id_usuario` int NOT NULL,
  `campeon_jugado` varchar(50) NOT NULL,
  `kills` int DEFAULT '0',
  `deaths` int DEFAULT '0',
  `assists` int DEFAULT '0',
  `minions_asesinados` int DEFAULT '0',
  `oro_total` int DEFAULT '0',
  `vision_score` int DEFAULT '0',
  PRIMARY KEY (`id_estadistica`),
  UNIQUE KEY `unico_usuario_partida` (`id_partida`,`id_usuario`),
  KEY `fk_stat_usuario` (`id_usuario`),
  CONSTRAINT `fk_stat_partida` FOREIGN KEY (`id_partida`) REFERENCES `partidas` (`id_partida`) ON DELETE CASCADE,
  CONSTRAINT `fk_stat_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla: historial_puntos
CREATE TABLE `historial_puntos` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `tipo_movimiento` enum('ingreso','egreso') NOT NULL,
  `cantidad_puntos` int NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `id_referencia` int DEFAULT NULL,
  `fecha_movimiento` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `fk_historial_usuario` (`id_usuario`),
  CONSTRAINT `fk_historial_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2) Cargar los registros originales (padres antes que hijos)

-- Registros: equipos (2)
INSERT INTO `equipos` VALUES (1,'Equipo Poro','','activo','2026-04-03 22:14:03'),(2,'Equipo Ñuñu','','activo','2026-04-03 22:14:19');

-- Registros: recompensas (1)
INSERT INTO `recompensas` VALUES (1,'Mostrito ','Comida Peruana',100,3);

-- Registros: roles (3)
INSERT INTO `roles` VALUES (2,'admin'),(3,'superadmin'),(1,'user');

-- Registros: torneos (5)
INSERT INTO `torneos` VALUES (1,'Primer torneo de LeagueOfSports','5v5','2026-04-03','pendiente'),(2,'Segundo Torneo','1v1','2026-04-03','pendiente'),(3,'Tercer torneo','5v5','2026-04-03','pendiente'),(4,'Copa prueba','5v5','2026-04-06','pendiente'),(5,'Copa prueba 2','5v5','2026-04-06','finalizado');

-- Registros: partidas (4)
INSERT INTO `partidas` VALUES (1,1,1,2,1,30,'2026-04-03 22:32:46'),(2,2,1,2,1,15,'2026-04-04 02:55:23'),(3,3,1,2,2,10,'2026-04-04 02:59:11'),(5,5,1,2,2,10,'2026-04-06 20:29:06');

-- Registros: torneo_equipos (10)
INSERT INTO `torneo_equipos` VALUES (1,1,2,'registrado','2026-04-03 22:21:31'),(2,1,1,'registrado','2026-04-03 22:21:34'),(3,2,2,'registrado','2026-04-04 02:55:16'),(4,2,1,'registrado','2026-04-04 02:55:17'),(5,3,2,'registrado','2026-04-04 02:59:06'),(6,3,1,'registrado','2026-04-04 02:59:07'),(9,5,2,'registrado','2026-04-06 20:28:59'),(10,5,1,'registrado','2026-04-06 20:29:00'),(11,4,2,'registrado','2026-04-06 20:52:41'),(12,4,1,'registrado','2026-04-06 20:52:45');

-- Registros: usuarios (18)
INSERT INTO `usuarios` VALUES (19,1,'nunupro','$2y$10$oSY8WK2w2/eldYCK2BvbwOTYXw.1VIIB0fo8cxaK4jumXasn8.Z.K','Esmeralda',6,'activo','2026-04-02 09:39:05'),(20,3,'zeros','$2y$10$Hx5qU2hEbGwkqgvUIupcB.vM56PjXps8Qea4XdBvrvRdqOmtbc9aC','Platino',0,'activo','2026-04-02 09:39:05'),(21,1,'josue','$2b$10$MOqI96x2uesyP5mjALOuBOjoFjNtyGsAIvj1N4zTMUcPVPpUQqI4a','Diamante',3,'activo','2026-04-02 09:39:05'),(22,1,'chakito','$2y$10$3w.U82p0l1PrD4FfOmgnEOtqgbNy6tPL7pg4ow8lsbCxr0KZmjvPG','Oro',0,'activo','2026-04-02 09:39:05'),(23,1,'jhoncitopro','$2y$10$WxsCziPFkOSYxNg8tW.FAuNLByozm.wwVgwBCEVBAdDL11dYYYiwe','Platino',0,'activo','2026-04-02 09:39:05'),(24,1,'jhair','$2y$10$.j.lLGPWLrWCphHeIXBjruguptrjXLVahXb.M9U4tXLvVkwjQiQsy','Diamante',6,'activo','2026-04-02 09:39:05'),(25,1,'willy','$2y$10$5KHkzq42oIq7q5XIrmd9a.RaOVlRIVZEj3oAs7qeg6INkfCc8FGaW','Platino',0,'activo','2026-04-02 09:39:05'),(26,1,'jandro','$2y$10$sZpbmpeFw5/JBsOqAb.wYOT/YctdxNKoVyD.BV/QFVEx4XyX95FQS','Platino',0,'activo','2026-04-02 09:39:05'),(27,1,'evans','$2y$10$hGsSNBZgyslOz0yap86ccuXHED8jb/zo7Tq4ySobXjy8jy84n/Cr6','Esmeralda',6,'activo','2026-04-02 09:39:05'),(28,1,'kohai','$2y$10$JXHwf01tXQ3MczNqN82sX.x3ladjBHHisoifW/IkXbVdXxZUhf0ay','Oro',3,'activo','2026-04-02 09:39:05'),(29,1,'poro','$2y$10$OltCx72PcRaM37QqpbSXg.PMBveKCpyFDEG3Fa.DWIyZeQoHO0b9q','Diamante',0,'activo','2026-04-02 09:39:05'),(30,1,'juan','$2y$10$D9Ud9xz/jD4Nr3At.6AmPuWNtMv2HfvAETmzqjjUpQ4nl0hviJc0C','Platino',3,'activo','2026-04-02 09:39:05'),(31,1,'jhosep','$2y$10$YWfux77ItujyQXzu7KlsqeNwkKBSkQ5NQAoueFpp7fQCzjDEO3YKu','Unranked',0,'activo','2026-04-02 09:39:05'),(32,1,'triple A','$2y$10$4EcWz.TjQoUvI03/LpS0SOMcnI8Et2JqQsU3OyhTZR8ir79PHbxZC','Platino',0,'activo','2026-04-02 09:39:05'),(33,1,'Arroz con pollo','$2b$10$dO65wa0Kok4a/9UynEYcquXg8doN9obBWnrjbJRxfGUG6Ftamy3Au','Platino',0,'activo','2026-11-14 02:58:14'),(34,1,'Eizan','$2b$10$0rTNRTwuSNSjCIGo3qOjUensDQT6CzkU.j02GN6c96panjfqrrfEq','Esmeralda',0,'activo','2026-11-14 02:59:38'),(35,1,'H2Stark','$2b$10$kiuUwPt5QCj6fqjutZ.0fOaqNib5TUo0BiHwcPAE/nKT9ym/HNahG','Platino',6,'activo','2026-11-14 03:08:37'),(36,1,'GOOT PODYEROSO C','$2b$10$KgEjcQl/k92QAiFg0.jmHOvZdXK5GTep6yYLeSwBoQxqlhpBoAEtm','Plata',3,'activo','2026-11-17 05:24:50');

-- Registros: equipo_miembros (12)
INSERT INTO `equipo_miembros` VALUES (1,21,'Titular','2026-04-06 23:54:19'),(1,23,'Titular','2026-04-03 22:15:27'),(1,26,'Titular','2026-04-06 23:54:29'),(1,28,'Suplente','2026-04-06 23:54:36'),(1,29,'Capitan','2026-04-06 23:54:18'),(1,31,'Titular','2026-04-06 23:54:25'),(2,19,'Capitan','2026-04-06 23:53:56'),(2,20,'Titular','2026-04-03 22:15:11'),(2,24,'Titular','2026-04-06 23:53:53'),(2,25,'Titular','2026-04-03 22:14:53'),(2,30,'Titular','2026-04-06 23:54:05'),(2,32,'Suplente','2026-04-06 23:54:11');

-- Registros: estadisticas_partida (2)
INSERT INTO `estadisticas_partida` VALUES (1,1,19,'Kog\'maw',10,2,5,200,5000,20),(2,1,21,'Wukong',20,2,10,220,4000,21);

-- Registros: historial_puntos (0)
-- Sin registros en el respaldo original.

-- 3) Comprobacion rapida (lectura):
SELECT COUNT(*) AS cantidad_tablas FROM information_schema.tables WHERE table_schema = 'leagueofsports' AND table_type = 'BASE TABLE';
SELECT 'usuarios' AS tabla, COUNT(*) AS registros FROM `usuarios`
UNION ALL SELECT 'roles', COUNT(*) FROM `roles`
UNION ALL SELECT 'equipos', COUNT(*) FROM `equipos`
UNION ALL SELECT 'equipo_miembros', COUNT(*) FROM `equipo_miembros`
UNION ALL SELECT 'torneos', COUNT(*) FROM `torneos`
UNION ALL SELECT 'torneo_equipos', COUNT(*) FROM `torneo_equipos`
UNION ALL SELECT 'partidas', COUNT(*) FROM `partidas`
UNION ALL SELECT 'estadisticas_partida', COUNT(*) FROM `estadisticas_partida`
UNION ALL SELECT 'recompensas', COUNT(*) FROM `recompensas`
UNION ALL SELECT 'historial_puntos', COUNT(*) FROM `historial_puntos`;
