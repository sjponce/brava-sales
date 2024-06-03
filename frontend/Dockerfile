# Stage 1: Build frontend
FROM node:20.9.0-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
COPY vite.config.js ./
COPY . .

RUN npm install --production
RUN npm run build

# Stage 2: Run frontend
FROM node:20.9.0-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/frontend/.env ./
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]