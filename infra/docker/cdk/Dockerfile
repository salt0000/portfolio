FROM node:18.2-alpine

WORKDIR /cdk

RUN npm install -g aws-cdk@2.75.1
RUN npm install -g npm@8.12.1

COPY ./docker/cdk/.aws/ /.aws/