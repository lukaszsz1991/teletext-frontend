FROM node:20-alpine AS build

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY src ./src
RUN npm run build

FROM nginx:1.29.3-alpine
RUN apk add --no-cache gettext

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY env.template.js /usr/share/nginx/html/env.template.js
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]