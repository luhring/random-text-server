FROM node:6.1.0-onbuild

COPY . /var/www

WORKDIR /var/www

RUN npm install

EXPOSE 3000

ENTRYPOINT  ["node", "app.js"]
