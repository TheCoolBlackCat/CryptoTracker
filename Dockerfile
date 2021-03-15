FROM node:15.10-alpine

WORKDIR /app
COPY .next .next
COPY node_modules node_modules
COPY public public
COPY package.json .
COPY .env* .

# RUN yarn
# RUN yarn build

CMD yarn start
