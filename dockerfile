# ARM-compatible Node.js image for Raspberry Pi
FROM node:18-bullseye

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./

# Copy all source files
COPY . .

RUN npm install

RUN npx prisma generate

# Build TypeScript to JavaScript
RUN npm run build

# Expose app port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]

