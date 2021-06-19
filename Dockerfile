FROM artifactory.asredanesh.com/docker/node:current-buster-slim

WORKDIR /usr/src/app
COPY client/package.json ./
RUN  ls 
#cd client 
RUN npm install
COPY client/* .
WORKDIR /usr/src/app
####RUN npm run build
RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]
