FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN npm install -g npm@10.2.4

COPY package*.json ./
COPY vite.config.js ./

COPY . .

RUN npm install --production
RUN npm run build
RUN npm run preview

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]