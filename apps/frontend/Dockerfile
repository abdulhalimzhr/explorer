FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Copy the built application
COPY --from=builder /app/.output ./.output

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nuxt -u 1001

# Change ownership of the app directory
RUN chown -R nuxt:nodejs /app
USER nuxt

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]