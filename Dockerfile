# Step 1: Build the Angular application
FROM node:20.11.0-alpine AS build

# Set the working directory (Inside the container)
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install -g @angular/cli

RUN npm install

# Copy the source code to the container
COPY . .

# Build the Angular application
#RUN npm run build --prod

CMD ["ng", "serve", "--host", "0.0.0.0"]

# Step 2: Serve the application using Nginx
#FROM nginx:1.25.2-alpine
#
## Copier les fichiers construits d'Angular dans le répertoire de Nginx
#COPY --from=build /app/dist/easy-recruit-front-end /usr/share/nginx/html
#
## Exposer le port 80 pour Nginx (port par défaut)
#EXPOSE 8083
#
## Lancer Nginx en mode non-démon
#CMD ["nginx", "-g", "daemon off;"]





