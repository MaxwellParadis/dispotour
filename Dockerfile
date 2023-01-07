FROM node:18-alpine
RUN apk add bash
WORKDIR /app
COPY package.json .
RUN npm install
COPY server.js .
RUN mkdir static
COPY static/dist static/dist
RUN mkdir static/photos
ENV PORT 8014
CMD ["npm", "start"]