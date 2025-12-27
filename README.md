# E-Bank - Système Bancaire en Ligne

Une application bancaire complète construite avec une architecture microservices, comprenant un backend Java Spring Boot et un frontend React moderne.

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Technologies Utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage de l'Application](#démarrage-de-lapplication)
- [Points d'Accès](#points-daccès)
- [API Endpoints](#api-endpoints)
- [Rôles Utilisateurs](#rôles-utilisateurs)
- [Structure du Projet](#structure-du-projet)
- [Développement](#développement)
  - [Mise à Jour des Conteneurs](#mise-à-jour-des-conteneurs)
- [Dépannage](#dépannage)

## Vue d'ensemble

E-Bank est une application bancaire en ligne qui permet aux clients de gérer leurs comptes bancaires, consulter leurs transactions et effectuer des virements. L'application est conçue avec une architecture microservices pour assurer la scalabilité, la maintenabilité et la résilience.

### Caractéristiques Principales

- **Architecture Microservices** : Services indépendants et déployables séparément
- **Service Discovery** : Découverte automatique des services via Eureka
- **Configuration Centralisée** : Gestion centralisée de la configuration via Spring Cloud Config
- **Sécurité JWT** : Authentification et autorisation basées sur JWT
- **Interface Moderne** : Frontend React avec Tailwind CSS
- **Containerisation** : Déploiement simplifié avec Docker et Docker Compose

## Architecture

L'application suit une architecture microservices avec les composants suivants :

```
                    ┌─────────────────┐
                    │  React Frontend │ (Port 3002)
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   API Gateway   │ (Port 8080)
                    └────────┬────────┘
                             │
    ┌─────────┬──────────────│──────────────┬────────────────┐
    ▼         ▼              ▼              ▼                ▼
┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌────────────┐
│  Auth   │ │ Clients  │ │  Bank    │ │Transaction│ |Notification│
│ Service │ │ Service  │ │ Account  │ │ Service   │ │  Service   │
└─────────┘ └──────────┘ └──────────┘ └───────────┘ └────────────┘
    │           │              │              │              │
    └───────────┴──────────────|──────────────┴──────────────┘
                               │
                    ┌──────────┴─────────┐
                    ▼                    ▼
            ┌──────────────┐    ┌──────────────┐
            │   Eureka     │    │    Config    │
            │  Discovery   │    │    Server    │
            │   (8761)     │    │    (8888)    │
            └──────────────┘    └──────────────┘
                              │
                              ▼
                    ┌──────────────┐
                    │    MySQL     │
                    │   (3307)     │
                    └──────────────┘
```

### Services

1. **discovery-server** : Service de découverte Eureka pour l'enregistrement et la découverte des microservices
2. **config-server** : Serveur de configuration centralisé (Spring Cloud Config)
3. **authentication-service** : Gestion de l'authentification et de l'autorisation des utilisateurs
4. **clients-service** : Gestion des clients et de leurs informations
5. **bankAccount-service** : Gestion des comptes bancaires
6. **transaction-service** : Gestion des transactions bancaires et des virements
7. **notifications-service** : Envoi d'emails (notifications, identifiants)
8. **api-gateway** : Point d'entrée unique pour toutes les requêtes API
9. **react-frontend** : Interface utilisateur React

## Technologies Utilisées

### Backend
- **Java 17** : Langage de programmation
- **Spring Boot 3.x** : Framework principal
- **Spring Cloud** : 
  - Eureka (Service Discovery)
  - Config Server (Configuration centralisée)
  - OpenFeign (Communication inter-services)
  - Gateway (API Gateway)
- **Spring Security** : Sécurité et authentification JWT
- **Spring Data JPA** : Accès aux données
- **MySQL 8.0** : Base de données relationnelle
- **Maven** : Gestion des dépendances et build
- **Spring Mail** : Envoi d'emails

### Frontend
- **React 18** : Bibliothèque UI
- **Vite** : Build tool et dev server
- **React Router DOM** : Routage
- **Axios** : Client HTTP
- **Tailwind CSS** : Framework CSS utilitaire
- **Nginx** : Serveur web pour la production

### Infrastructure
- **Docker** : Containerisation
- **Docker Compose** : Orchestration des conteneurs

## Fonctionnalités

### Pour les Agents (AGENT_GUICHET)
- Création et gestion des clients
- Création et gestion des comptes bancaires
- Consultation des informations clients
- Modification du statut des comptes (actif, bloqué, clôturé)
- Consultation des transactions

### Pour les Clients (CLIENT)
- Connexion et authentification sécurisée
- Consultation des informations personnelles
- Visualisation des comptes bancaires
- Consultation du tableau de bord avec :
  - Numéro RIB
  - Solde du compte
  - Les 10 dernières opérations bancaires
  - Support de plusieurs comptes avec liste déroulante
  - Pagination pour consulter d'autres opérations
- Effectuer des virements avec validation :
  - RG_11 : Le compte ne doit pas être bloqué ou clôturé
  - RG_12 : Le solde doit être supérieur au montant du virement
  - RG_13 : Débit du compte émetteur
  - RG_14 : Crédit du compte destinataire
  - RG_15 : Traçabilité des opérations avec dates précises
- Changement de mot de passe
- Réception d'emails avec identifiants lors de la création de compte

## Prérequis

### Pour Docker (Recommandé)
- **Docker Desktop** (ou Docker Engine + Docker Compose)
- **8GB RAM minimum** disponible
- **Ports disponibles** : 3002, 3307, 8080, 8761, 8888

### Pour le Développement Local
- **Java 17** ou supérieur
- **Maven 3.6+**
- **MySQL 8.0**
- **Node.js 16+** et npm
- **Git**

## Installation

### Option 1 : Installation avec Docker (Recommandé)

1. **Cloner le dépôt** :
   ```bash
   git clone <repository-url>
   cd e-bank
   ```

2. **Configurer les variables d'environnement** (optionnel) :
   - Les configurations par défaut sont dans `docker-compose.yml`
   - Pour la production, modifiez les mots de passe et les secrets

3. **Construire et démarrer tous les services** :
   ```bash
   docker-compose up --build
   ```

   Ou en mode détaché (arrière-plan) :
   ```bash
   docker-compose up -d --build
   ```

4. **Vérifier que tous les services sont démarrés** :
   ```bash
   docker-compose ps
   ```

5. **Accéder à l'application** :
   - Frontend : http://localhost:3002
   - API Gateway : http://localhost:8080
   - Eureka Dashboard : http://localhost:8761
   - Config Server : http://localhost:8888

### Option 2 : Installation Locale (Développement)

#### 1. Base de Données

Créer les bases de données MySQL :
```sql
CREATE DATABASE ebank_auth;
CREATE DATABASE ebank_clients;
CREATE DATABASE ebank_accounts;
CREATE DATABASE ebank_transactions;
```

#### 2. Configuration

Le Config Server lit la configuration depuis un dépôt GitHub public : `https://github.com/Haytam158/e-bank-config.git`

**Note** : Les fichiers de configuration sont stockés dans le dépôt GitHub. Pour modifier la configuration :
1. Clonez ou modifiez le dépôt GitHub : `https://github.com/Haytam158/e-bank-config.git`
2. Les fichiers de configuration doivent être dans le dossier `config/` du dépôt
3. Le Config Server récupère automatiquement les changements au démarrage

Assurez-vous que :
- Les URLs de base de données sont correctes dans les fichiers de configuration GitHub
- Les secrets JWT sont configurés dans le dépôt GitHub

#### 3. Démarrer les Services (dans l'ordre)

1. **Discovery Server** :
   ```bash
   cd discovery-server
   mvn spring-boot:run
   ```

2. **Config Server** :
   ```bash
   cd config-server
   mvn spring-boot:run
   ```

3. **Services métier** (dans n'importe quel ordre après discovery et config) :
   ```bash
   # Terminal 1
   cd authentication-service
   mvn spring-boot:run

   # Terminal 2
   cd clients-service
   mvn spring-boot:run

   # Terminal 3
   cd bankAccount-service
   mvn spring-boot:run

   # Terminal 4
   cd transaction-service
   mvn spring-boot:run

   # Terminal 5
   cd notifications-service
   mvn spring-boot:run
   ```

4. **API Gateway** :
   ```bash
   cd api-gateway
   mvn spring-boot:run
   ```

5. **Frontend React** :
   ```bash
   cd react
   npm install
   npm run dev
   ```

## ⚙️ Configuration

### Configuration Centralisée (Config Server)

Le Config Server lit la configuration depuis un dépôt GitHub public :
- **Repository** : `https://github.com/Haytam158/e-bank-config.git`
- **Branch** : `master`
- **Chemin** : `config/` dans le dépôt

Pour modifier la configuration :
1. Accédez au dépôt GitHub : [e-bank-config](https://github.com/Haytam158/e-bank-config)
2. Modifiez les fichiers dans le dossier `config/`
3. Committez et poussez les changements
4. Redémarrez les services pour qu'ils récupèrent la nouvelle configuration

### Configuration Email (Notifications Service)

Pour que le service de notifications fonctionne, configurez les identifiants Gmail dans le fichier `notifications-service.properties` du dépôt GitHub :

```properties
spring.mail.username=votre-email@gmail.com
spring.mail.password=votre-app-password
```

**Note** : Utilisez un [App Password Gmail](https://support.google.com/accounts/answer/185833) plutôt que votre mot de passe principal.

### Configuration JWT

Les secrets JWT sont configurés dans le fichier `authentication-service.properties` du dépôt GitHub :

```properties
jwt.secret=votre-secret-jwt-tres-securise
jwt.expiration=3600000
```

### Configuration Base de Données

Les configurations de base de données sont dans `docker-compose.yml` pour Docker, ou dans les fichiers `application.properties` de chaque service pour le développement local.

## Démarrage de l'Application

### Avec Docker

```bash
# Démarrer tous les services
docker-compose up

# Démarrer en arrière-plan
docker-compose up -d

# Reconstruire et démarrer (après modifications de code)
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (réinitialise la base de données)
docker-compose down -v
```

**Note** : Pour mettre à jour les conteneurs après des modifications, consultez la section [Mise à Jour des Conteneurs](#mise-à-jour-des-conteneurs) dans Développement.

### Localement

1. Démarrer MySQL
2. Démarrer Discovery Server
3. Démarrer Config Server
4. Démarrer tous les microservices
5. Démarrer API Gateway
6. Démarrer le frontend React

## Points d'Accès

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3002 | Interface utilisateur React |
| API Gateway | http://localhost:8080 | Point d'entrée API |
| Eureka Dashboard | http://localhost:8761 | Service Discovery UI |
| Config Server | http://localhost:8888 | Configuration centralisée |
| MySQL | localhost:3307 | Base de données (Docker) |

## API Endpoints

Tous les endpoints sont accessibles via l'API Gateway à `http://localhost:8080/api`.

### Authentification (`/api/auth`)

| Méthode   | Endpoint                      | Description               | Rôle Requis   |
|-----------|-------------------------------|---------------------------|---------------|
| POST      | `/auth/register/{roleName}`   | Inscription avec rôle     | Public        |
| POST      | `/auth/login`                 | Connexion                 | Public        |
| GET       | `/auth/validate`              | Valider le token JWT      | Authentifié   |
| POST      | `/auth/change-password`       | Changer le mot de passe   | CLIENT        |
| GET       | `/auth/users/{userId}/info`   | Informations utilisateur  | Authentifié   |
| GET       | `/auth/users/{userId}/roles`  | Rôles utilisateur         | Authentifié   |
| DELETE    | `/auth/users/{username}`      | Supprimer un utilisateur  | AGENT_GUICHET |

### Clients (`/api/clients`)

| Méthode   | Endpoint                          | Description                   | Rôle Requis   |
|-----------|-----------------------------------|-------------------------------|-------------  |
| POST      | `/clients/create-client`          | Créer un client               | AGENT_GUICHET |
| GET       | `/clients/{id}`                   | Obtenir un client par ID      | AGENT_GUICHET |
| GET       | `/clients/user/{userId}`          | Obtenir un client par userId  | AGENT_GUICHET |
| GET       | `/clients/user/{userId}/details`  | Détails complets utilisateur  | CLIENT        |
| GET       | `/clients/clients?page=0&size=10` | Liste paginée des clients     | AGENT_GUICHET |
| DELETE    | `/clients/user/{userId}`          | Supprimer un client           | AGENT_GUICHET |

### Comptes Bancaires (`/api/accounts`)

| Méthode   | Endpoint                              | Description                   | Rôle Requis           |
|-----------|---------------------------------------|-------------------------------|-----------------------|
| POST      | `/accounts`                           | Créer un compte bancaire      | AGENT_GUICHET         |
| GET       | `/accounts/{id}`                      | Obtenir un compte par ID      | AGENT_GUICHET, CLIENT |
| GET       | `/accounts/rib/{rib}`                 | Obtenir un compte par RIB     | AGENT_GUICHET, CLIENT |
| GET       | `/accounts/customer/{customerId}`     | Comptes d'un client (paginé)  | AGENT_GUICHET, CLIENT |
| PUT       | `/accounts/{id}/balance`              | Mettre à jour le solde        | AGENT_GUICHET         |
| PUT       | `/accounts/{id}/status?status=ACTIVE` | Modifier le statut            | AGENT_GUICHET         |
| DELETE    | `/accounts/{id}`                      | Supprimer un compte           | AGENT_GUICHET         |

### Transactions (`/api/transactions`)

| Méthode   | Endpoint                                          | Description                   | Rôle Requis           |
|-----------|---------------------------------------------------|-------------------------------|-----------------------|
| GET       | `/transactions/account/{rib}/dashboard`           | Tableau de bord du compte     | AGENT_GUICHET, CLIENT |
| GET       | `/transactions/account/{rib}`                     | Transactions par RIB (paginé) | AGENT_GUICHET, CLIENT |
| GET       | `/transactions/rib/{rib}`                         | Transactions par RIB (alias)  | AGENT_GUICHET, CLIENT |
| GET       | `/transactions/customer/{customerId}/accounts`    | Tous les comptes d'un client  | AGENT_GUICHET, CLIENT |
| GET       | `/transactions/account/recent`                    | RIB le plus récemment actif   | AGENT_GUICHET, CLIENT |
| POST      | `/transactions/transfer`                          | Effectuer un virement         | CLIENT                |

### Notifications (`/api/notifications`)

| Méthode   | Endpoint                          | Description                       | Rôle Requis   |
|-----------|-----------------------------------|-----------------------------------|---------------|
| POST      | `/notifications/send-credentials` | Envoyer identifiants par email    | AGENT_GUICHET |

## 👥 Rôles Utilisateurs

### AGENT_GUICHET
- Gestion complète des clients et comptes bancaires
- Création de nouveaux clients
- Création de comptes bancaires
- Consultation de toutes les transactions
- Modification des statuts de comptes

### CLIENT
- Consultation de ses propres informations
- Consultation de ses comptes bancaires
- Consultation de ses transactions
- Effectuer des virements
- Changer son mot de passe

## 📁 Structure du Projet

```
e-bank/
├── api-gateway/              # API Gateway (Spring Cloud Gateway)
├── authentication-service/   # Service d'authentification
├── bankAccount-service/      # Service de gestion des comptes
├── clients-service/          # Service de gestion des clients
├── config-server/           # Serveur de configuration
├── discovery-server/        # Service Discovery (Eureka)
├── notifications-service/   # Service de notifications email
├── transaction-service/     # Service de transactions
├── react/                   # Frontend React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services API
│   │   └── config/         # Configuration
│   └── Dockerfile          # Dockerfile pour React
├── e-bank-config/          # Configuration locale (optionnel, pour référence)
│   ├── api-gateway.properties
│   ├── authentication-service.properties
│   ├── clients-service.properties
│   └── ...
│   Note: La configuration active est dans le dépôt GitHub
│   https://github.com/Haytam158/e-bank-config.git
├── docker-compose.yml       # Orchestration Docker
├── Dockerfile.java         # Dockerfile générique pour services Java
├── init-db.sql             # Script d'initialisation MySQL
├── pom.xml                 # POM parent Maven
└── README.md               # Ce fichier
```

## Développement

### Mise à Jour des Conteneurs

La méthode de mise à jour dépend du type de changement :

#### 1. Changements de Code (Java/React)

Si vous avez modifié le code source, vous devez reconstruire les images :

```bash
# Reconstruire et redémarrer tous les services
docker-compose up -d --build

# Ou reconstruire sans cache (recommandé pour forcer une reconstruction complète)
docker-compose build --no-cache
docker-compose up -d
```

#### 2. Changements de Configuration GitHub

Si vous avez modifié la configuration dans le dépôt GitHub :

```bash
# Redémarrer uniquement le Config Server pour récupérer les nouvelles configs
docker-compose restart config-server

# Puis redémarrer les services qui utilisent cette configuration
docker-compose restart authentication-service clients-service bankAccount-service transaction-service notifications-service api-gateway
```

#### 3. Changements dans docker-compose.yml

Si vous avez modifié `docker-compose.yml` :

```bash
# Arrêter les services
docker-compose down

# Reconstruire et redémarrer
docker-compose up -d --build
```

#### 4. Mise à Jour d'un Service Spécifique

```bash
# Reconstruire un service spécifique
docker-compose build [service-name]

# Reconstruire et redémarrer un service spécifique
docker-compose up -d --build [service-name]

# Exemple : Mettre à jour uniquement le frontend React
docker-compose up -d --build react-frontend
```

#### 5. Forcer une Reconstruction Complète (Sans Cache)

Utile si vous rencontrez des problèmes ou voulez être sûr que tout est reconstruit :

```bash
# Arrêter tous les services
docker-compose down

# Reconstruire sans utiliser le cache
docker-compose build --no-cache

# Redémarrer
docker-compose up -d
```

### Rebuild un Service Spécifique (Docker)

```bash
# Reconstruire un service
docker-compose build [service-name]

# Reconstruire et redémarrer
docker-compose up -d --build [service-name]
```

### Accéder aux Logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f [service-name]
```

### Exécuter des Commandes dans les Conteneurs

```bash
# Accéder à MySQL
docker-compose exec mysql mysql -uroot -proot123

# Accéder au shell d'un service
docker-compose exec [service-name] sh
```

### Développement Frontend

```bash
cd react
npm install
npm run dev
```

Le frontend sera disponible sur http://localhost:3002 (ou le port configuré dans Vite).

### Tests

```bash
# Tests Maven (dans chaque service)
mvn test

# Tests avec Docker
docker-compose exec [service-name] mvn test
```

## Dépannage

### Services ne démarrent pas

1. **Vérifier les logs** :
   ```bash
   docker-compose logs [service-name]
   ```

2. **Vérifier l'état des services** :
   ```bash
   docker-compose ps
   ```

3. **Vérifier les ports disponibles** :
   ```bash
   # Windows
   netstat -an | findstr "3002 3307 8080 8761 8888"
   
   # Linux/Mac
   netstat -an | grep -E '3002|3307|8080|8761|8888'
   ```

### Problèmes de Connexion à la Base de Données

- Vérifier que MySQL est démarré : `docker-compose ps mysql`
- Vérifier les logs MySQL : `docker-compose logs mysql`
- Vérifier que les bases de données existent :
  ```bash
  docker-compose exec mysql mysql -uroot -proot123 -e "SHOW DATABASES;"
  ```

### Problèmes de Service Discovery

- Attendre que Eureka démarre en premier (vérifier http://localhost:8761)
- Les services s'enregistrent avec Eureka après leur démarrage
- Vérifier les logs : `docker-compose logs discovery-server`

### Problèmes de Configuration (Config Server)

- Vérifier que le Config Server peut accéder au dépôt GitHub : `docker-compose logs config-server`
- Vérifier que le dépôt GitHub est public et accessible : `https://github.com/Haytam158/e-bank-config`
- Vérifier que les fichiers de configuration sont dans le dossier `config/` du dépôt
- Le Config Server clone automatiquement le dépôt au démarrage (`clone-on-start=true`)
- Pour forcer une mise à jour, redémarrez le Config Server : `docker-compose restart config-server`

### Frontend ne se connecte pas au Backend

- Vérifier que l'API Gateway est démarré : `docker-compose ps api-gateway`
- Vérifier la configuration nginx dans `react/nginx.conf`
- Le frontend utilise des URLs relatives (`/api`) qui sont proxifiées vers `api-gateway:8080`

### Erreur "Port already in use"

Si un port est déjà utilisé :
1. Identifier le processus utilisant le port
2. Arrêter le processus ou modifier le port dans `docker-compose.yml`
3. Pour MySQL, le port est mappé sur 3307 (au lieu de 3306) pour éviter les conflits

### Erreurs d'Authentification

- Vérifier que le secret JWT est configuré correctement
- Vérifier que le token JWT est inclus dans les en-têtes : `Authorization: Bearer <token>`
- Vérifier les logs d'authentification : `docker-compose logs authentication-service`

### Emails ne sont pas envoyés

- Vérifier la configuration Gmail dans `e-bank-config/notifications-service.properties`
- Utiliser un App Password Gmail (pas le mot de passe principal)
- Vérifier les logs : `docker-compose logs notifications-service`

## Notes Importantes

- **MySQL Port** : Dans Docker, MySQL est mappé sur le port **3307** (au lieu de 3306) pour éviter les conflits avec une instance MySQL locale
- **Frontend** : Le frontend React est servi via nginx en mode production dans Docker
- **Réseau Docker** : Tous les services communiquent via le réseau Docker `ebank-network`
- **Service Discovery** : Les services utilisent Eureka pour la découverte automatique
- **Configuration** : La configuration est centralisée via Config Server qui lit depuis un dépôt GitHub public : `https://github.com/Haytam158/e-bank-config.git`. Les fichiers de configuration doivent être dans le dossier `config/` du dépôt.
- **Persistance** : Les données MySQL sont persistées dans le volume Docker `mysql_data`

## Déploiement en Production

Pour un déploiement en production, considérez :

1. **Sécurité** :
   - Utiliser des secrets managés (Docker Secrets, Vault, etc.)
   - Ne pas hardcoder les mots de passe
   - Configurer HTTPS/SSL
   - Utiliser des secrets JWT forts

2. **Ressources** :
   - Configurer des limites de ressources dans `docker-compose.yml`
   - Monitoring et alerting (Prometheus, Grafana)

3. **Haute Disponibilité** :
   - Utiliser Docker Swarm ou Kubernetes
   - Réplication de base de données
   - Load balancing

4. **Logging** :
   - Centraliser les logs (ELK stack, Loki)
   - Rotation des logs

5. **Configuration** :
   - Utiliser des profils Spring différents (dev, prod)
   - Configuration externe via variables d'environnement

## Licence

Ce projet fait partie d'un projet académique.

## Auteur

Projet développé dans le cadre d'un cours de Java 5ème année.

---

**Note** : Pour plus de détails sur le déploiement Docker, consultez [README.DOCKER.md](README.DOCKER.md).

