FROM node:18-alpine

USER root
RUN apk add --no-cache python3 make g++ \
	&& mkdir -p /usr/src/node-app \
	&& chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json  ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

USER node

EXPOSE 5000

CMD ["npm", "start"]
 