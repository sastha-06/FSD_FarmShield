# Use an official lightweight Python image that includes build tools
FROM python:3.10-slim

# Install Node.js (version 18 or 20)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy root package configuration
COPY package*.json ./
COPY dev.js ./

# Copy and install backend dependencies
COPY server/package*.json ./server/
RUN npm install --prefix server

# Copy and install Python AI dependencies
COPY ai_service/requirements.txt ./ai_service/
RUN pip install --no-cache-dir -r ai_service/requirements.txt

# Copy the rest of the project files
COPY . .

# Expose backend port
EXPOSE 5000

# Set working directory to server and start the app
WORKDIR /app/server
CMD ["npm", "start"]
