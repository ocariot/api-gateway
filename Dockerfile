FROM node:10.15.3
RUN mkdir -p /usr/src/ag 
WORKDIR /usr/src/ag 

COPY . /usr/src/ag/ 
RUN npm install 
COPY . /usr/src/ag 

EXPOSE 9876
EXPOSE 8080

ENTRYPOINT npm start

