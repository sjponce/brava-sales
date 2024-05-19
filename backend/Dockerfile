FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN npm install -g npm@10.2.4

COPY package*.json ./

COPY . .

RUN npm install

ENV HOST 0.0.0.0
ENV PORT 8080
EXPOSE 8080

CMD ["npm", "run", "dev"]