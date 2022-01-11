FROM node:16.10.0

RUN corepack enable \
    && yarn config set registry https://registry.npm.taobao.org \
    && yarn global add @angular/cli@13 
