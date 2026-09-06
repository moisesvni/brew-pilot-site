FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_MODE=production
ENV VITE_MODE=${VITE_MODE}
ARG VITE_SITE_URL=https://brewpilot.com
ENV VITE_SITE_URL=${VITE_SITE_URL}

RUN npm run build -- --mode ${VITE_MODE}


FROM nginx:alpine AS runtime

RUN apk add --no-cache curl

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
