FROM artifactory.asredanesh.com/docker/node:current-buster-slim
# Install node packages
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
# Copy application source
WORKDIR /usr/src
COPY . ./app
WORKDIR /usr/src/app
# Build App
RUN yarn build
# Deploy
EXPOSE 3000
CMD [ "yarn", "start" ]
#####

