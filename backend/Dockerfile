FROM node:20-alpine
RUN apk add --no-cache openssl libc6-compat mysql-client
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
EXPOSE 8765
CMD ["npm", "start"]