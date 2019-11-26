FROM node:11

WORKDIR /opt/the-sonosynthesiser-api

COPY package*.json ./

RUN npm install

COPY . ./

CMD ["node", "server"]