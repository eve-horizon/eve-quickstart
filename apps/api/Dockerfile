FROM node:20-alpine

# OCI image labels — links this image to the source repo
# Replace the URL below with your actual repository URL
LABEL org.opencontainers.image.source="https://github.com/OWNER/REPO"
LABEL org.opencontainers.image.description="Eve Horizon starter API"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY index.js db.js ./
COPY public ./public

EXPOSE 3000

CMD ["node", "index.js"]
