FROM node:18.13.0

COPY ./ ./

EXPOSE 3000

RUN npm install
RUN npm run build
CMD npm start