--CREATE DATABASE IF NOT EXISTS valenzodb
SELECT 'CREATE DATABASE valenzodb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'valenzodb')\gexec