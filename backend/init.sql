-- Script de inicialización para PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear usuario si no existe
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'admin') THEN

      CREATE ROLE admin LOGIN PASSWORD 'admin123';
   END IF;
END
$do$;

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE admin_panel_db TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
