# Базовый образ: https://hub.docker.com/_/node
FROM node:19.0.1 as build-stage
WORKDIR /source
COPY package*.json /source/

ARG REACT_APP_SERVER_ADDRESS
RUN echo "" > /source/.env
RUN echo "REACT_APP_SERVER_ADDRESS=${REACT_APP_SERVER_ADDRESS}" >> /source/.env

RUN npm install --legacy-peer-deps
COPY ./ /source/
RUN npm run build

# Базовый образ: https://hub.docker.com/_/nginx
FROM nginx:1.23.1-alpine
COPY --from=build-stage /source/build/ /usr/share/nginx/html
COPY --from=build-stage /source/docker/image/nginx.conf /etc/nginx/conf.d/default.conf