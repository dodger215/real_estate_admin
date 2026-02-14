# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Custom Nginx configuration to listen on port 4000
RUN sed -i 's/listen       80;/listen       4000;/' /etc/nginx/conf.d/default.conf

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]
