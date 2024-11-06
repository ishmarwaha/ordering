FROM node:lts

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 50052

CMD [ "npm", "run", "start" ]