FROM node:20-slim

WORKDIR /app

# Copy package files FIRST, install, THEN copy code.
# This ordering lets Docker cache the npm install layer:
# code changes don't trigger a re-install.
COPY package.json package-lock.json ./
RUN npm install --production

COPY server.js ./

EXPOSE 8000

CMD ["node", "server.js"]
