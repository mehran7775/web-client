FROM artifactory.asredanesh.com/docker/node:current-buster-slim

WORKDIR /usr/src/app
COPY client/package.json ./
RUN  ls 
#cd client 
RUN npm install
COPY . .
WORKDIR /usr/src/app
EXPOSE 8003
RUN npm run build
CMD [ "npm", "run", "start" ]
