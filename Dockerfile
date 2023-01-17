# Set the baseImage
FROM node:13.8.0

# Set the working directory
WORKDIR /app

# Copy files from source 
COPY ["package.json", "package-lock.json*", "./"]

#Install npm
RUN npm init
RUN npm install express
RUN npm i multer
RUN npm install mysql
RUN npm install dotenv
RUN npm install @aws-sdk/client-s3

# Bundle app source
COPY . .
CMD [ "node", "app.js" ]