-- Crée la DB Keycloak dans le même serveur Postgres (au premier démarrage uniquement).
-- Le user par défaut (POSTGRES_USER) est déjà créé par l'image officielle.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'keycloak') THEN
    CREATE DATABASE keycloak;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'postiz') THEN
    CREATE DATABASE postiz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'helpdesk') THEN
    CREATE DATABASE helpdesk;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'fossbilling') THEN
    CREATE DATABASE fossbilling;
  END IF;
END
$$;


