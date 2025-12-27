# E-Bank Docker Setup

This guide explains how to run the entire E-Bank application (Java microservices + React frontend) using Docker.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- At least 8GB RAM available
- Ports 3002, 3306, 8080, 8761, 8888 available

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Start in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes (clean database):**
   ```bash
   docker-compose down -v
   ```

## Services

The application consists of the following services:

- **MySQL** (port 3306): Database server
- **discovery-server** (port 8761): Eureka service discovery
- **config-server** (port 8888): Spring Cloud Config Server
- **authentication-service**: User authentication and authorization
- **clients-service**: Customer management
- **bankAccount-service**: Bank account management
- **transaction-service**: Transaction processing
- **notifications-service**: Email notifications
- **api-gateway** (port 8080): API Gateway (entry point for backend)
- **react-frontend** (port 3002): React frontend with nginx

## Access Points

- **Frontend**: http://localhost:3002
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Config Server**: http://localhost:8888

## Building Individual Services

### Java Services

Each Java service uses the generic `Dockerfile.java`:

```bash
# Example: Build authentication-service
docker build -f Dockerfile.java \
  --build-arg JAR_FILE=authentication-service/target/authentication-service-*.jar \
  -t ebank-authentication-service .
```

### React Frontend

```bash
cd react
docker build -t ebank-react-frontend .
```

## Environment Variables

All services use environment variables for configuration. Key variables:

- `SPRING_PROFILES_ACTIVE=docker`: Activates Docker profile
- `SPRING_DATASOURCE_URL`: Database connection URL
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`: Eureka server URL
- `SPRING_CLOUD_CONFIG_URI`: Config server URL

## Troubleshooting

### Services not starting

1. Check logs:
   ```bash
   docker-compose logs [service-name]
   ```

2. Verify all services are healthy:
   ```bash
   docker-compose ps
   ```

3. Check if ports are available:
   ```bash
   netstat -an | grep -E '3002|3306|8080|8761|8888'
   ```

### Database connection issues

- Ensure MySQL container is running: `docker-compose ps mysql`
- Check MySQL logs: `docker-compose logs mysql`
- Verify database was created: `docker-compose exec mysql mysql -uroot -proot123 -e "SHOW DATABASES;"`

### Service discovery issues

- Wait for Eureka to start first (check http://localhost:8761)
- Services register with Eureka after startup
- Check service registration: `docker-compose logs discovery-server`

### Frontend not connecting to backend

- Verify API Gateway is running: `docker-compose ps api-gateway`
- Check nginx configuration in `react/nginx.conf`
- Frontend uses relative URLs (`/api`), which nginx proxies to `api-gateway:8080`

## Development

### Rebuild after code changes

```bash
# Rebuild specific service
docker-compose build [service-name]

# Rebuild and restart
docker-compose up -d --build [service-name]
```

### Access service logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f [service-name]
```

### Execute commands in containers

```bash
# Access MySQL
docker-compose exec mysql mysql -uroot -proot123

# Access service shell
docker-compose exec [service-name] sh
```

## Production Considerations

For production deployment, consider:

1. **Use environment-specific configuration files**
2. **Set up proper secrets management** (don't hardcode passwords)
3. **Use Docker secrets or external secret managers**
4. **Configure proper resource limits** in docker-compose.yml
5. **Set up monitoring and logging** (e.g., ELK stack, Prometheus)
6. **Use reverse proxy** (nginx/traefik) for SSL termination
7. **Configure health checks** and restart policies
8. **Use Docker Swarm or Kubernetes** for orchestration

## Notes

- The React frontend is built and served via nginx in production mode
- All services communicate via Docker network (`ebank-network`)
- Service discovery uses Eureka (discovery-server)
- Configuration is centralized via Config Server
- MySQL databases are persisted in Docker volume `mysql_data`


