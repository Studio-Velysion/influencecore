-- Création des bases dans UNE SEULE instance MariaDB
-- InfluenceCore (Prisma), Keycloak, Helpdesk (Frappe) et FOSSBilling partagent le même serveur DB

CREATE DATABASE IF NOT EXISTS influencecore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS keycloak CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS helpdesk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS fossbilling CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


