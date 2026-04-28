CREATE DATABASE IF NOT EXISTS serv_alert
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE serv_alert;

CREATE TABLE IF NOT EXISTS reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  report_type ENUM('issue', 'restore') NOT NULL,
  service VARCHAR(80) NOT NULL,
  location VARCHAR(255) NOT NULL,
  full_name VARCHAR(140) NOT NULL,
  email VARCHAR(190) NOT NULL,
  dui VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reports_created_at (created_at),
  KEY idx_reports_type (report_type)
);
