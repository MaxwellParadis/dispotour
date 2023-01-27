FROM node:18-alpine
RUN apk add bash
WORKDIR /app
COPY package.json .
RUN npm install
COPY server.js .
RUN mkdir static
COPY client/dist client/dist
RUN mkdir static/photos
ENV PORT 3014
ENV SQL_PORT=3314
ENV SQL_USR=sqluser
ENV SQL_PW=YourPassword
ENV SQL_DB=DB
ENV SQL_HST=172.17.0.1
ENV KEY=APIKEY
CMD ["npm", "start"]