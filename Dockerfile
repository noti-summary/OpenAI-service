FROM node:18.12.0-slim as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:18.12.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

RUN npm install pm2 -g

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD [ "npm", "run", "pm2" ]