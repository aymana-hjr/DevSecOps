# Étape 1 : Construction de l'application avec Maven et JDK 21
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copier le fichier de configuration Maven (pom.xml)
COPY pom.xml .

# Télécharger les dépendances séparément pour mettre en cache cette étape
RUN mvn dependency:go-offline -B

# Copier le code source et compiler
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image de runtime légère JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copier le fichier JAR généré à l'étape précédente
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Exécuter l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
