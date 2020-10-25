FROM node:14.14.0
ENV NODE_ENV=production

ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start"]
