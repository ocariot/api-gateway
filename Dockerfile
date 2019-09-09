FROM node:10.16.3

# create and set app directory
RUN mkdir -p /usr/src/ag
WORKDIR /usr/src/ag

# install app dependencies
COPY . /usr/src/ag/
RUN npm install

# Copy app source
COPY . /usr/src/ag

EXPOSE 9876
EXPOSE 8080

CMD ["npm", "start"]

