FROM node:lts-alpine

WORKDIR /app 

COPY package.json ./ 

RUN npm i

COPY . . 

RUN npx prisma migrate
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]