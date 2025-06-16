# syntax=docker/dockerfile:1.4

FROM node:24.1.0-alpine3.22 AS base

WORKDIR /app

FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci

FROM deps AS build

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN npm run build

FROM nginx:alpine AS final
RUN addgroup -g 1001 appuser && adduser -u 1001 -G appuser -s /bin/sh -D appuser && \
  # Create cache dirs before dropping privileges
  mkdir -p /var/cache/nginx/client_temp && \
  chown -R appuser:appuser /var/cache/nginx

COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]