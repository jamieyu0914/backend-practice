# Set the baseImage
FROM node:18.13.0

# Set the working directory
WORKDIR /app

#Remember to set the ENV

# Copy files from source 
COPY ["package.json", "package-lock.json*", "./"]

#Install npm
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]