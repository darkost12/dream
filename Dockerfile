FROM node:18

ADD https://github.com/darkost12/dream/archive/refs/heads/main.zip .

RUN set -ex ;\
  apt-get update ;\
  apt-get install unzip ;\
  unzip main.zip

WORKDIR /dream-main

RUN set -ex ;\
  yarn install ;\
  yarn run build

CMD yarn run start
