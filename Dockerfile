# ─── Stage 1: Dependencies ───────────────────────────────────────────────────
FROM node:18-alpine AS deps

WORKDIR /app

# Copy only package files first for layer caching
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# ─── Stage 2: Production Image ───────────────────────────────────────────────
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling (PID 1 problem)
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser  -u 1001 -S nodejs -G nodejs

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy source code and assets
COPY --chown=nodejs:nodejs src/ ./src/
COPY --chown=nodejs:nodejs lang/ ./lang/
COPY --chown=nodejs:nodejs package.json ./

# Create logs directory with correct ownership
RUN mkdir -p /app/logs && chown nodejs:nodejs /app/logs

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 8080

# Health check — waits 30s then pings the server every 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:${APPLICATION_PORT:-8080}/api/v1 || exit 1

# Use dumb-init to handle signals correctly
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "src/server.js"]
