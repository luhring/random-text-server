FROM node:latest

ADD . .

EXPOSE 3000

CMD ["node","app.js"]