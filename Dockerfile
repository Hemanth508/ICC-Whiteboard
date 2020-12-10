FROM node

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
## Assets and source code copy
COPY . .
## expose port
EXPOSE 5400
##run
CMD [ "node", "server.js" ]