# -------- Stage 1: Build the app --------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Install dependencies
    COPY package.json package-lock.json ./
    RUN npm install
    
    # Copy the rest of the app
    COPY . .
    
    # Build the Next.js app
    RUN npm run build
    
    
    # -------- Stage 2: Serve the app --------
    FROM node:18-alpine AS runner
    
    WORKDIR /app
    
    # Install only production dependencies
    COPY package.json package-lock.json ./
    RUN npm install --production
    
    # Copy built app from builder stage
    COPY --from=builder /app/.next .next
    COPY --from=builder /app/public public
    COPY --from=builder /app/node_modules node_modules
    COPY --from=builder /app/package.json package.json
    
    # Expose the port Next.js runs on
    EXPOSE 3000
    
    # Start the app
    CMD ["npm", "start"]
    