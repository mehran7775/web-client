FROM artifactory.asredanesh.com/docker/node:lts-stretch-slim
# Install node packages
WORKDIR /usr/src/app
COPY ./client/package.json ./
COPY ./client/yarn.lock ./
RUN yarn install
# Copy application source
WORKDIR /usr/src
COPY ./client ./app
WORKDIR /usr/src/app
# Build App
RUN yarn build
ENV HOST=0.0.0.0
# Deploy
CMD [ "yarn", "start" ]
# Temporary dev
#CMD [ "yarn", "dev","--host","0.0.0.0","--host","bourse-ui" ]
#####

