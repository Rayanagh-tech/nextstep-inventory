# collector/Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY collector ./collector
WORKDIR /app/collector

CMD ["node", "index.js"]
