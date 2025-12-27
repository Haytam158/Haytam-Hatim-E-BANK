# Multi-stage build for Java Spring Boot services
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .
COPY */pom.xml ./

# Copy source code
COPY . .

# Build the application (skip tests for faster builds)
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Create app directory with proper permissions
RUN mkdir -p /app && chmod 755 /app

WORKDIR /app

# Copy the JAR from build stage
# SERVICE_NAME is the service directory name (e.g., "discovery-server")
ARG SERVICE_NAME
# Copy entire target directory and then extract the main JAR
COPY --from=build /app/${SERVICE_NAME}/target /tmp/target
# Find and copy the main JAR file (excludes sources, javadoc, and original JARs)
# Do this as root before creating the non-root user
RUN JAR_FILE=$(find /tmp/target -name "${SERVICE_NAME}-*.jar" ! -name "*-sources.jar" ! -name "*-javadoc.jar" ! -name "*-original.jar" | head -1) && \
    if [ -z "$JAR_FILE" ]; then \
      echo "ERROR: JAR file not found for ${SERVICE_NAME}" && \
      find /tmp/target -name "*.jar" && \
      exit 1; \
    fi && \
    cp "$JAR_FILE" /app/app.jar && \
    chmod 644 /app/app.jar && \
    rm -rf /tmp/target

# Create a non-root user and change ownership
RUN addgroup -S spring && adduser -S spring -G spring && \
    chown -R spring:spring /app

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

