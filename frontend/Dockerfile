# Étape 1 : Construction de l'application React avec Vite
FROM node:20-alpine AS build
WORKDIR /app

# Copier les fichiers de dépendances et installer
COPY package*.json ./
RUN npm ci || npm install

# Copier tout le code source et compiler
COPY . .
RUN npm run build

# Étape 2 : Serveur de production Nginx léger
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée avec le proxy inverse (CORS)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
