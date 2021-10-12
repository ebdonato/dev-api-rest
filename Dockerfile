FROM node:14

# environment variables
ENV NODE_ENV=production
ENV PG_CONNECTION_STRING=postgres://postgres:123456@localhost:5432/banco

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
