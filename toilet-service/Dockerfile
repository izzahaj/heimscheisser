# syntax=docker/dockerfile:1.4

# Stage 1: Base builder image
ARG GO_VERSION=1.24.2
FROM golang:${GO_VERSION}-bookworm AS base
WORKDIR /app

# Stage 2: Dependency cache layer
FROM base AS deps

RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,source=go.sum,target=go.sum \
    --mount=type=bind,source=go.mod,target=go.mod \
    go mod download -x

# Stage 3: Build the app
FROM deps AS build

COPY . .

RUN --mount=type=cache,target=/go/pkg/mod/ \
    CGO_ENABLED=0 go build -ldflags="-w -s" -o main .

# Stage 4: Final runtime image
FROM debian:bookworm-slim AS final

WORKDIR /app

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser appuser

COPY --from=build /app/main .

RUN chown appuser:appuser /app/main

USER appuser

EXPOSE 5000

CMD ["/app/main"]
