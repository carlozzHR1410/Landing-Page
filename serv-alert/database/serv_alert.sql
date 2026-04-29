CREATE DATABASE IF NOT EXISTS serv_alert
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE serv_alert;

DROP TABLE IF EXISTS reports;

CREATE TABLE reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  report_type ENUM('issue', 'restore') NOT NULL,
  status ENUM('active', 'restored') NOT NULL DEFAULT 'active',
  related_report_id BIGINT UNSIGNED NULL,
  service VARCHAR(80) NOT NULL,
  department VARCHAR(120) NOT NULL,
  district VARCHAR(120) NOT NULL,
  location VARCHAR(255) NOT NULL,
  full_name VARCHAR(140) NOT NULL,
  email VARCHAR(190) NOT NULL DEFAULT '',
  dui VARCHAR(20) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reports_created_at (created_at),
  KEY idx_reports_type (report_type),
  KEY idx_reports_status (status),
  KEY idx_reports_related_report_id (related_report_id),
  CONSTRAINT fk_reports_related_report
    FOREIGN KEY (related_report_id) REFERENCES reports (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

INSERT INTO reports (
  id,
  report_type,
  status,
  related_report_id,
  service,
  department,
  district,
  location,
  full_name,
  email,
  dui,
  description,
  created_at
) VALUES
  (101, 'issue', 'active', NULL, 'Electricidad', 'San Miguel', 'San Miguel', 'San Miguel, San Miguel', 'Rosa Hernandez', '', '', 'Varias cuadras sin energia desde la madrugada en la colonia Milagro de la Paz.', '2026-04-29 02:20:00'),
  (102, 'issue', 'restored', NULL, 'Agua Potable', 'Usulutan', 'Usulutan', 'Usulutan, Usulutan', 'Mario Torres', '', '', 'No llega agua en la colonia Palermo desde anoche.', '2026-04-29 00:10:00'),
  (103, 'issue', 'active', NULL, 'Electricidad', 'La Union', 'Conchagua', 'Conchagua, La Union', 'Camila Cruz', '', '', 'Bajones frecuentes y cortes parciales en el casco urbano.', '2026-04-28 15:35:00'),
  (104, 'issue', 'restored', NULL, 'Electricidad', 'Morazan', 'San Francisco Gotera', 'San Francisco Gotera, Morazan', 'Jose Mejia', '', '', 'Apagon en la zona del mercado central.', '2026-04-28 12:15:00'),
  (105, 'issue', 'active', NULL, 'Agua Potable', 'San Miguel', 'Chirilagua', 'Chirilagua, San Miguel', 'Andrea Flores', '', '', 'Presion muy baja y cortes intermitentes en canton El Cuco.', '2026-04-28 08:45:00'),
  (106, 'issue', 'restored', NULL, 'Agua Potable', 'Usulutan', 'Jiquilisco', 'Jiquilisco, Usulutan', 'Kevin Argueta', '', '', 'Falla total del bombeo en el sector del malecon.', '2026-04-27 14:00:00'),
  (107, 'issue', 'active', NULL, 'Electricidad', 'La Union', 'Santa Rosa de Lima', 'Santa Rosa de Lima, La Union', 'Gloria Ventura', '', '', 'Transformador con fallas y apagones repetidos por la tarde.', '2026-04-27 10:30:00'),
  (108, 'issue', 'restored', NULL, 'Agua Potable', 'Morazan', 'Jocoro', 'Jocoro, Morazan', 'Cesar Portillo', '', '', 'Servicio suspendido en el centro y barrios cercanos.', '2026-04-27 07:05:00'),
  (109, 'issue', 'active', NULL, 'Agua Potable', 'San Miguel', 'Ciudad Barrios', 'Ciudad Barrios, San Miguel', 'Diana Romero', '', '', 'Tanques con poca presion en oficinas y viviendas del distrito.', '2026-04-26 13:40:00'),
  (110, 'issue', 'restored', NULL, 'Electricidad', 'Usulutan', 'Berlin', 'Berlin, Usulutan', 'Hector Ramos', '', '', 'Postes afectados por lluvia intensa cerca del parque.', '2026-04-26 09:25:00'),
  (111, 'issue', 'active', NULL, 'Agua Potable', 'La Union', 'La Union', 'La Union, La Union', 'Patricia Sorto', '', '', 'El agua llega turbia y con baja presion en el sector portuario.', '2026-04-25 17:10:00'),
  (112, 'issue', 'active', NULL, 'Electricidad', 'Morazan', 'Perquin', 'Perquin, Morazan', 'Julio Ayala', '', '', 'Corte total en varias viviendas despues de la lluvia.', '2026-04-24 22:25:00'),
  (113, 'issue', 'restored', NULL, 'Agua Potable', 'Usulutan', 'Santiago de Maria', 'Santiago de Maria, Usulutan', 'Norma Campos', '', '', 'Sin agua en la zona alta del distrito desde temprano.', '2026-04-24 09:00:00'),
  (114, 'issue', 'active', NULL, 'Electricidad', 'San Miguel', 'Moncagua', 'Moncagua, San Miguel', 'Ernesto Romero', '', '', 'Voltaje inestable y cortes breves en el casco urbano.', '2026-04-23 19:15:00'),
  (115, 'issue', 'active', NULL, 'Agua Potable', 'Morazan', 'Sociedad', 'Sociedad, Morazan', 'Marina Pineda', '', '', 'El servicio no llega a varias colonias desde hace dos dias.', '2026-04-22 11:50:00'),
  (116, 'issue', 'restored', NULL, 'Electricidad', 'La Union', 'Pasaquina', 'Pasaquina, La Union', 'Samuel Reyes', '', '', 'Linea primaria con fallas luego de fuertes vientos.', '2026-04-21 16:35:00'),
  (117, 'issue', 'active', NULL, 'Agua Potable', 'San Miguel', 'El Transito', 'El Transito, San Miguel', 'Lorena Benitez', '', '', 'Colonias del norte sin bombeo durante toda la manana.', '2026-04-20 07:45:00'),
  (118, 'issue', 'active', NULL, 'Electricidad', 'Usulutan', 'Alegria', 'Alegria, Usulutan', 'Rene Menendez', '', '', 'Apagones nocturnos frecuentes en varios barrios.', '2026-04-19 23:05:00'),
  (119, 'issue', 'restored', NULL, 'Agua Potable', 'La Union', 'Santa Rosa de Lima', 'Santa Rosa de Lima, La Union', 'Silvia Flores', '', '', 'Baja presion generalizada en la red principal.', '2026-04-18 14:20:00'),
  (120, 'issue', 'active', NULL, 'Electricidad', 'Morazan', 'Corinto', 'Corinto, Morazan', 'Adan Caceres', '', '', 'Sector del mercado sin energia y semaforos apagados.', '2026-04-17 12:40:00'),
  (121, 'issue', 'active', NULL, 'Agua Potable', 'Usulutan', 'Berlin', 'Berlin, Usulutan', 'Teresa Quintanilla', '', '', 'Cisternas vacias en las viviendas de la zona poniente.', '2026-04-16 10:30:00'),
  (122, 'issue', 'restored', NULL, 'Electricidad', 'San Miguel', 'Chapeltique', 'Chapeltique, San Miguel', 'Melvin Castro', '', '', 'Dano en transformador de la calle principal.', '2026-04-15 18:55:00'),
  (201, 'restore', 'restored', 102, 'Agua Potable', 'Usulutan', 'Usulutan', 'Usulutan, Usulutan', 'Sandra Lopez', '', '', 'El servicio de agua se normalizo esta manana en la colonia.', '2026-04-29 03:05:00'),
  (202, 'restore', 'restored', 104, 'Electricidad', 'Morazan', 'San Francisco Gotera', 'San Francisco Gotera, Morazan', 'Luis Ramirez', '', '', 'La energia volvio luego del trabajo de cuadrillas.', '2026-04-28 14:40:00'),
  (203, 'restore', 'restored', 106, 'Agua Potable', 'Usulutan', 'Jiquilisco', 'Jiquilisco, Usulutan', 'Marta Escobar', '', '', 'La distribucion de agua volvio y quedo estable en el sector.', '2026-04-27 16:10:00'),
  (204, 'restore', 'restored', 108, 'Agua Potable', 'Morazan', 'Jocoro', 'Jocoro, Morazan', 'Ana Chicas', '', '', 'Se restablecio el agua y regreso la presion habitual.', '2026-04-27 12:25:00'),
  (205, 'restore', 'restored', 110, 'Electricidad', 'Usulutan', 'Berlin', 'Berlin, Usulutan', 'Carlos Gonzalez', '', '', 'La zona reporto energia estable despues de la tormenta.', '2026-04-26 12:10:00'),
  (206, 'restore', 'restored', 113, 'Agua Potable', 'Usulutan', 'Santiago de Maria', 'Santiago de Maria, Usulutan', 'Julia Fuentes', '', '', 'El bombeo se recupero y el agua regreso a la zona alta.', '2026-04-24 17:10:00'),
  (207, 'restore', 'restored', 116, 'Electricidad', 'La Union', 'Pasaquina', 'Pasaquina, La Union', 'Rodrigo Escobar', '', '', 'La linea fue reparada y el servicio quedo estable.', '2026-04-21 19:20:00'),
  (208, 'restore', 'restored', 119, 'Agua Potable', 'La Union', 'Santa Rosa de Lima', 'Santa Rosa de Lima, La Union', 'Patricia Renderos', '', '', 'La presion se estabilizo en los hogares del distrito.', '2026-04-18 18:00:00'),
  (209, 'restore', 'restored', 122, 'Electricidad', 'San Miguel', 'Chapeltique', 'Chapeltique, San Miguel', 'Harold Amaya', '', '', 'Cambio de transformador completado y energia restablecida.', '2026-04-15 21:30:00');
