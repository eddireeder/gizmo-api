FROM node:11

WORKDIR /opt/gizmo-api

COPY package*.json ./

RUN npm install

COPY . ./

CMD ["node", "server"]