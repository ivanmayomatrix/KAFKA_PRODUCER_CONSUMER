FROM node:18-alpine

RUN apk update
RUN apk upgrade

COPY ./scripts/init.sh /scripts/init.sh

WORKDIR /scripts
CMD [ "sh", "./init.sh" ]