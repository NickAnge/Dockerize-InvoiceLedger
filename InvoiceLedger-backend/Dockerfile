#node image LTS(long term support)
FROM node:14

#Create app directory
WORKDIR /usr/src/app

#Install app dependencies
##both package.json AND package-lock.json are copied
##must be available
COPY package*.json ./

##insstall dependencies
RUN npm install


# bundle apps's source code inside theDocker image
COPY . .
COPY ./wait-for-it.sh .
#Exposed Port
##EXPOSE 5000

CMD "node" "server.js"
