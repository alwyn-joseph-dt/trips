# Stage 1: Build React App
FROM node:20 AS build
WORKDIR /app
# Copy package files first for better Docker layer caching
COPY package.json ./
# COPY package-lock.json* ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]