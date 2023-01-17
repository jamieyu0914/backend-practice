# Set the baseImage
FROM node:13.8.0

# Set the working directory
WORKDIR /app

# Copy files from source 
COPY ["package.json", "package-lock.json*", "./"]

#Install npm
RUN npm install

# Bundle app source
COPY . .
CMD [ "node", "app.js" ]