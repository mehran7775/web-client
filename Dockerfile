FROM artifactory.asredanesh.com/docker/node:current-buster-slim

WORKDIR /usr/src/app
COPY client/package.json ./
RUN  ls 
#cd client 
RUN ls 
RUN npm install
COPY client/* ./
RUN ls
WORKDIR /usr/src/app
RUN ls
####RUN npm run build
RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]
