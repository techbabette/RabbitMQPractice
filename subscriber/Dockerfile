FROM node:20
WORKDIR /app

COPY . .

ARG MQ
ENV MQ $MQ

RUN npm i

CMD ["npm", "run", "start"] 