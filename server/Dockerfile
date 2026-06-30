# -------------- BUILD STAGE -----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build 


# ---------------- PRODUCTION STAGE ------------- 
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD [ "npm", "run", "start" ]
